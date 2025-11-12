import React from "react";
import "./layout.css";

function formatDate(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export default function TaskItem({ task, categoryMap, onToggleComplete, onEdit, onDelete }) {
  /** Single task row item */
  const cat = task.categoryId ? categoryMap[task.categoryId] || categoryMap[task.categoryId._id] : null;
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggleComplete(task)}
          aria-label={`Mark ${task.title} ${task.completed ? "active" : "completed"}`}
        />
        <span />
      </label>
      <div className="task-main">
        <div className="task-title">{task.title}</div>
        {task.description ? <div className="task-desc">{task.description}</div> : null}
        <div className="task-meta">
          {cat ? (
            <span className="chip" title={`Category: ${cat.name}`}>
              <span className="dot" style={{ backgroundColor: cat.color || "#64748b" }} />
              {cat.name}
            </span>
          ) : null}
          {task.priority ? <span className={`chip p${task.priority}`}>P{task.priority}</span> : null}
          {task.dueDate ? <span className="chip due">Due: {formatDate(task.dueDate)}</span> : null}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" title="Edit" onClick={() => onEdit(task)}>✏️</button>
        <button className="icon-btn danger" title="Delete" onClick={() => onDelete(task)}>🗑️</button>
      </div>
    </div>
  );
}
