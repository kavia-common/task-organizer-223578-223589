import { useCallback, useEffect, useMemo, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask, patchTask } from "../services/tasks";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../services/categories";

/**
 * useTasks hook centralizes task and category data, filters, and CRUD operations.
 * It also exposes loading and error states suitable for simple UIs.
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [tasksMeta, setTasksMeta] = useState({});
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    completed: "",
    priority: "",
    sort: "createdAt",
    order: "desc",
    page: 1,
    limit: 20,
    dueFrom: "",
    dueTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listTasks(filters);
      // The API spec does not define a fixed response shape; support both array or {items,meta}
      if (Array.isArray(data)) {
        setTasks(data);
        setTasksMeta({});
      } else if (data && typeof data === "object") {
        setTasks(data.items || data.tasks || []);
        setTasksMeta(data.meta || {});
      } else {
        setTasks([]);
        setTasksMeta({});
      }
    } catch (e) {
      setError(e.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshCategories = useCallback(async () => {
    setCatLoading(true);
    setError("");
    try {
      const data = await listCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === "object") {
        setCategories(data.items || data.categories || []);
      } else {
        setCategories([]);
      }
    } catch (e) {
      setError(e.message || "Failed to load categories");
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? value : 1 }));
  }, []);

  const createTaskAction = useCallback(
    async (payload) => {
      await createTask(payload);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const updateTaskAction = useCallback(
    async (id, payload) => {
      await updateTask(id, payload);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const patchTaskAction = useCallback(
    async (id, payload) => {
      await patchTask(id, payload);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const deleteTaskAction = useCallback(
    async (id) => {
      await deleteTask(id);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const createCategoryAction = useCallback(
    async (payload) => {
      await createCategory(payload);
      await refreshCategories();
    },
    [refreshCategories]
  );

  const updateCategoryAction = useCallback(
    async (id, payload) => {
      await updateCategory(id, payload);
      await refreshCategories();
      await refreshTasks();
    },
    [refreshCategories, refreshTasks]
  );

  const deleteCategoryAction = useCallback(
    async (id) => {
      await deleteCategory(id);
      await refreshCategories();
      await refreshTasks();
    },
    [refreshCategories, refreshTasks]
  );

  const state = useMemo(
    () => ({
      tasks,
      tasksMeta,
      categories,
      filters,
      loading,
      catLoading,
      error,
    }),
    [tasks, tasksMeta, categories, filters, loading, catLoading, error]
  );

  const actions = useMemo(
    () => ({
      setFilter,
      refreshTasks,
      refreshCategories,
      createTask: createTaskAction,
      updateTask: updateTaskAction,
      patchTask: patchTaskAction,
      deleteTask: deleteTaskAction,
      createCategory: createCategoryAction,
      updateCategory: updateCategoryAction,
      deleteCategory: deleteCategoryAction,
    }),
    [
      setFilter,
      refreshTasks,
      refreshCategories,
      createTaskAction,
      updateTaskAction,
      patchTaskAction,
      deleteTaskAction,
      createCategoryAction,
      updateCategoryAction,
      deleteCategoryAction,
    ]
  );

  return { state, actions };
}
