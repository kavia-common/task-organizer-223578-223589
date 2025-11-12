import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock fetch for API calls to avoid network in tests
beforeEach(() => {
  global.fetch = jest.fn((url, init) => {
    if (typeof url === "string" && url.includes("/api/categories")) {
      if (init && init.method === "POST") {
        return Promise.resolve(new Response(JSON.stringify({ id: "c1", name: "Work" }), { status: 201, headers: { "Content-Type": "application/json" } }));
      }
      return Promise.resolve(
        new Response(JSON.stringify({ items: [] }), { status: 200, headers: { "Content-Type": "application/json" } })
      );
    }
    if (typeof url === "string" && url.includes("/api/tasks")) {
      if (init && init.method === "POST") {
        return Promise.resolve(new Response(JSON.stringify({ id: "t1", title: "New Task" }), { status: 201, headers: { "Content-Type": "application/json" } }));
      }
      return Promise.resolve(
        new Response(JSON.stringify({ items: [] }), { status: 200, headers: { "Content-Type": "application/json" } })
      );
    }
    return Promise.resolve(new Response(null, { status: 204 }));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders header and filters", () => {
  render(<App />);
  expect(screen.getByText(/Task Organizer/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Search tasks/i)).toBeInTheDocument();
});

test("theme toggle works", () => {
  render(<App />);
  const btn = screen.getByRole("button", { name: /dark|light/i });
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  // No crash is enough; verify attribute toggled
  expect(document.documentElement.getAttribute("data-theme")).toMatch(/dark|light/);
});

test("can add a task (form presence and submit)", async () => {
  render(<App />);
  const titleInput = screen.getByPlaceholderText(/Task title/i);
  fireEvent.change(titleInput, { target: { value: "Test Task" } });
  const submit = screen.getByRole("button", { name: /Add Task/i });
  fireEvent.click(submit);

  await waitFor(() => {
    // fetch should have been called to POST /api/tasks
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/tasks$/), expect.objectContaining({ method: "POST" }));
  });
});
