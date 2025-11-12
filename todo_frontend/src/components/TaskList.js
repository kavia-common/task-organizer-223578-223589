import React, { useMemo } from "react";
import TaskItem from "./TaskItem";
import "./layout.css";

// PUBLIC_INTERFACE
export default function TaskList({ tasks, categories, onToggleComplete, onEdit, onDelete, page, onPageChange, meta }) {
  /** Renders a list of tasks with pagination controls if meta present */
  const categoryMap = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => {
      m[c.id || c._id] = c;
    });
    return m;
  }, [categories]);

  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id || t._id}
          task={t}
          categoryMap={categoryMap}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {tasks.length === 0 && <div className="empty-state">No tasks found.</div>}

      {meta && (meta.totalPages || meta.total || meta.hasNextPage) ? (
        <div className="pagination">
          <button className="btn btn-secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <span className="page-info">Page {page}</span>
          <button className="btn btn-secondary" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
