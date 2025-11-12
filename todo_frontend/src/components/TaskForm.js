import React, { useEffect, useState } from "react";
import "./layout.css";

// PUBLIC_INTERFACE
export default function TaskForm({ categories, initial, onCancel, onSubmit }) {
  /** Form to create or edit a task */
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    dueDate: "",
    priority: 3,
    completed: false,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        categoryId: initial.categoryId || "",
        dueDate: initial.dueDate ? initial.dueDate.substring(0, 10) : "",
        priority: initial.priority || 3,
        completed: !!initial.completed,
      });
    }
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      description: form.description || "",
      categoryId: form.categoryId || null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      priority: Number(form.priority) || 3,
      completed: !!form.completed,
    };
    onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <label className="form-row">
        <span>Title</span>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Task title"
        />
      </label>
      <label className="form-row">
        <span>Description</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Details..."
        />
      </label>
      <label className="form-row">
        <span>Category</span>
        <select
          value={form.categoryId}
          onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
        >
          <option value="">None</option>
          {(categories || []).map((c) => (
            <option key={c.id || c._id} value={c.id || c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label className="form-row">
          <span>Due date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
          />
        </label>
        <label className="form-row">
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                P{p}
              </option>
            ))}
          </select>
        </label>
        <label className="form-row checkbox-row">
          <span>Completed</span>
          <input
            type="checkbox"
            checked={!!form.completed}
            onChange={(e) => setForm((p) => ({ ...p, completed: e.target.checked }))}
          />
        </label>
      </div>
      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="btn" type="submit">
          {initial ? "Save" : "Add Task"}
        </button>
      </div>
    </form>
  );
}
