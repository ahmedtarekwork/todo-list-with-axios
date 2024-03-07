import { MouseEvent, RefObject, useState } from "react";
import axios, { axiosPost } from "../../axios";
import { Todo } from "../../types";
import { MdDelete, MdEdit } from "react-icons/md";
import useDispatch from "../../hooks/useDispatch";
import { removeTodo, editTodo } from "../../store/features/todosSlice";
import { FormRefType } from "../AddTaskForm";

const TodoItem = ({
  _id,
  checked,
  todo,
  formRef,
}: Todo & { formRef: RefObject<FormRefType> }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete("/" + _id);
      setLoading(false);

      dispatch(removeTodo(_id));
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleEdit = () => {
    if (formRef.current)
      formRef.current.switchMode({ mode: "edit", text: todo, id: _id });
  };

  const handleChecked = async (e: MouseEvent<HTMLLIElement>) => {
    if (e.target !== e.currentTarget) return;

    try {
      setLoading(true);
      const res = await axiosPost.patch("/" + _id, { completed: !checked });
      dispatch(editTodo(res.data));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <li
      id={_id}
      className={`todo ${checked ? "checked" : ""} ${
        loading ? "disabled" : ""
      }`}
      onClick={handleChecked}
    >
      <p>{todo}</p>
      <div className="todo-btns-holder">
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={loading}
        >
          <MdDelete />
        </button>

        <button className="edit-btn" onClick={handleEdit} disabled={loading}>
          <MdEdit />
        </button>
      </div>
    </li>
  );
};
export default TodoItem;
