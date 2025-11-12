import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./components/layout.css";
import Header from "./components/Header";
import CategorySidebar from "./components/CategorySidebar";
import Filters from "./components/Filters";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { useTasks } from "./hooks/useTasks";

// PUBLIC_INTERFACE
function App() {
  /**
   * Main app component wiring the layout, tasks state, and CRUD handlers.
   * Provides a theme toggle leveraging data-theme attribute set on <html>.
   */
  const [theme, setTheme] = useState("light");
  const { state, actions } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const categorySelectedId = useMemo(() => state.filters.categoryId || "", [state.filters]);

  const onToggleComplete = async (task) => {
    await actions.patchTask(task.id || task._id, { completed: !task.completed });
  };

  const onEditTask = (task) => setEditingTask(task);
  const onDeleteTask = async (task) => {
    await actions.deleteTask(task.id || task._id);
    if (editingTask && (editingTask.id === task.id || editingTask._id === task._id)) {
      setEditingTask(null);
    }
  };

  const onSubmitTask = async (payload) => {
    if (editingTask) {
      await actions.updateTask(editingTask.id || editingTask._id, payload);
      setEditingTask(null);
    } else {
      await actions.createTask(payload);
    }
  };

  return (
    <div className="app-shell">
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <CategorySidebar
        categories={state.categories}
        selectedId={categorySelectedId}
        onSelect={(cat) => actions.setFilter("categoryId", cat.id || cat._id || "")}
        onCreate={actions.createCategory}
        onUpdate={actions.updateCategory}
        onDelete={actions.deleteCategory}
      />
      <main className="main">
        <div className="controls">
          <div className="card">
            <Filters
              filters={state.filters}
              categories={state.categories}
              onChange={actions.setFilter}
            />
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Add / Edit Task</h2>
            <TaskForm
              categories={state.categories}
              initial={editingTask}
              onCancel={() => setEditingTask(null)}
              onSubmit={onSubmitTask}
            />
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Tasks</h2>
              {state.loading ? <span className="chip">Loading...</span> : null}
              {state.error ? <span className="chip" style={{ borderColor: "var(--error)", color: "var(--error)" }}>{state.error}</span> : null}
            </div>
            <TaskList
              tasks={state.tasks}
              categories={state.categories}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              page={state.filters.page}
              onPageChange={(p) => actions.setFilter("page", p)}
              meta={state.tasksMeta}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
