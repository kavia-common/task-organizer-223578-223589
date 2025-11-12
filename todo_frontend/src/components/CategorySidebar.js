import React, { useMemo, useState } from "react";
import "./layout.css";

function CategoryRow({ category, active, onSelect, onDelete, onEdit }) {
  return (
    <div className={`category-row ${active ? "active" : ""}`} role="button" tabIndex={0} onClick={() => onSelect(category)} onKeyDown={(e)=>{ if(e.key==='Enter') onSelect(category)}}>
      <div className="category-color" style={{ backgroundColor: category.color || "#3b82f6" }} />
      <div className="category-name">{category.name}</div>
      <div className="spacer" />
      <div className="category-actions">
        <button
          className="icon-btn"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
        >
          ✏️
        </button>
        <button
          className="icon-btn danger"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function CategorySidebar({ categories, selectedId, onSelect, onCreate, onUpdate, onDelete }) {
  /** Sidebar for browsing and managing categories */
  const [form, setForm] = useState({ name: "", color: "#3b82f6" });
  const [editing, setEditing] = useState(null);

  const sorted = useMemo(
    () => [...(categories || [])].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      await onUpdate(editing.id || editing._id, { name: form.name.trim(), color: form.color || null });
      setEditing(null);
    } else {
      await onCreate({ name: form.name.trim(), color: form.color || null });
    }
    setForm({ name: "", color: "#3b82f6" });
  };

  const beginEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name || "", color: c.color || "#3b82f6" });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Categories</h2>
        <button className="btn btn-link" onClick={() => onSelect({ id: "", name: "All" })}>
          All
        </button>
      </div>

      <div className="category-list">
        {sorted.map((c) => (
          <CategoryRow
            key={c.id || c._id}
            category={c}
            active={selectedId && (c.id === selectedId || c._id === selectedId)}
            onSelect={(cat) => onSelect(cat)}
            onDelete={(cat) => onDelete(cat.id || cat._id)}
            onEdit={beginEdit}
          />
        ))}
        {sorted.length === 0 && <div className="empty-state">No categories yet.</div>}
      </div>

      <div className="sidebar-form">
        <h3>{editing ? "Edit Category" : "New Category"}</h3>
        <form onSubmit={submit}>
          <label className="form-row">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Work"
            />
          </label>
          <label className="form-row">
            <span>Color</span>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              aria-label="Category color"
            />
          </label>
          <div className="form-actions">
            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", color: "#3b82f6" });
                }}
              >
                Cancel
              </button>
            )}
            <button className="btn" type="submit">
              {editing ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
