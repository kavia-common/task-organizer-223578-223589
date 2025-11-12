import React, { useState } from "react";
import "./layout.css";

// PUBLIC_INTERFACE
export default function Filters({ filters, categories, onChange }) {
  /** Filters bar for tasks list */
  const [local, setLocal] = useState({
    search: filters.search || "",
    categoryId: filters.categoryId || "",
    completed: filters.completed || "",
    priority: filters.priority || "",
    sort: filters.sort || "createdAt",
    order: filters.order || "desc",
    dueFrom: filters.dueFrom || "",
    dueTo: filters.dueTo || "",
  });

  const apply = (patch) => {
    const next = { ...local, ...patch };
    setLocal(next);
    Object.entries(patch).forEach(([k, v]) => onChange(k, v));
  };

  return (
    <div className="filters">
      <input
        className="input"
        placeholder="Search tasks..."
        value={local.search}
        onChange={(e) => apply({ search: e.target.value })}
      />
      <select
        className="select"
        value={local.categoryId}
        onChange={(e) => apply({ categoryId: e.target.value })}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {(categories || []).map((c) => (
          <option key={c.id || c._id} value={c.id || c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        className="select"
        value={local.completed}
        onChange={(e) => apply({ completed: e.target.value })}
        aria-label="Filter by status"
      >
        <option value="">Any status</option>
        <option value="true">Completed</option>
        <option value="false">Active</option>
      </select>
      <select
        className="select"
        value={local.priority}
        onChange={(e) => apply({ priority: e.target.value })}
        aria-label="Priority"
      >
        <option value="">Any priority</option>
        {[1, 2, 3, 4, 5].map((p) => (
          <option key={p} value={p}>
            P{p}
          </option>
        ))}
      </select>
      <label className="date-range">
        <span>Due from</span>
        <input
          type="date"
          value={local.dueFrom ? local.dueFrom.substring(0, 10) : ""}
          onChange={(e) => apply({ dueFrom: e.target.value ? new Date(e.target.value).toISOString() : "" })}
        />
      </label>
      <label className="date-range">
        <span>to</span>
        <input
          type="date"
          value={local.dueTo ? local.dueTo.substring(0, 10) : ""}
          onChange={(e) => apply({ dueTo: e.target.value ? new Date(e.target.value).toISOString() : "" })}
        />
      </label>
      <select
        className="select"
        value={local.sort}
        onChange={(e) => apply({ sort: e.target.value })}
        aria-label="Sort by"
      >
        {["dueDate", "priority", "createdAt", "updatedAt", "title"].map((s) => (
          <option key={s} value={s}>
            Sort: {s}
          </option>
        ))}
      </select>
      <select
        className="select"
        value={local.order}
        onChange={(e) => apply({ order: e.target.value })}
        aria-label="Order"
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );
}
