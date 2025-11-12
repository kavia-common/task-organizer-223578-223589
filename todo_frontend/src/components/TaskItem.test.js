import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "./TaskItem";

test("renders task item and toggles complete", () => {
  const task = { id: "t1", title: "Hello", completed: false, priority: 2 };
  const categoryMap = {};
  const onToggleComplete = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  render(<TaskItem task={task} categoryMap={categoryMap} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />);

  expect(screen.getByText("Hello")).toBeInTheDocument();
  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
  expect(onToggleComplete).toHaveBeenCalled();
});
