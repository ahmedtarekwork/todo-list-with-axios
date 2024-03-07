import { RefObject } from "react";
import { Todo } from "../../types";
import { FormRefType } from "../AddTaskForm";
import TodoItem from "./TodoItem";

const TodosList = ({
  todos,
  formRef,
}: {
  todos: Todo[];
  formRef: RefObject<FormRefType>;
}) => {
  if (!todos.length) return;

  return (
    // todo: sorting list

    <ul className="todos-list">
      {todos.map((todo) => (
        <TodoItem formRef={formRef} key={todo._id} {...todo} />
      ))}
    </ul>
  );
};
export default TodosList;
