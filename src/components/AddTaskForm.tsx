import {
  FormEvent,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { axiosPost } from "../axios";

import useDispatch from "../hooks/useDispatch";
import { addTodo, editTodo } from "../store/features/todosSlice";

type Mode = "normal" | "edit";
type funcParam =
  | {
      mode: "normal";
    }
  | {
      mode: "edit";
      text: string;
      id: string;
    };

export type FormRefType = {
  switchMode: (params: funcParam) => void;
};

const AddTaskForm = forwardRef<FormRefType>((_, ref) => {
  // states
  const [mode, setMode] = useState<Mode>("normal");
  const [todoId, setTodoId] = useState("");
  const [loading, setLoading] = useState(false);

  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // functions
  const switchMode: FormRefType["switchMode"] = (params) => {
    const { mode } = params;

    setMode(mode);

    const input = inputRef.current;

    if (mode === "edit") {
      setTodoId(params.id);
      input?.focus();
    }

    if (input) input.value = mode === "normal" ? "" : params.text;
  };

  const disableTodo = (disable: boolean) => {
    document.getElementById(todoId)?.classList.toggle("disabled", disable);
  };

  useImperativeHandle(ref, () => ({ switchMode }), []);

  const dispatch = useDispatch();

  // event handlers
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const input = inputRef.current;

    if (input?.value.trim()) {
      try {
        setLoading(true);
        if (mode === "normal") {
          const res = await axiosPost.post("/", { title: input.value.trim() });
          dispatch(addTodo(res.data));
        } else {
          if (!todoId) throw new Error("no todo id has found !");

          disableTodo(true);
          const res = await axiosPost.patch("/" + todoId, {
            title: input.value.trim(),
          });
          disableTodo(false);

          dispatch(editTodo(res.data));

          switchMode({ mode: "normal" });
        }

        setLoading(false);

        formRef.current?.reset();
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else {
      console.log("fill all inputs and try again");
      alert("fill all inputs and try again");
    }
  };

  const btnContent = mode === "normal" ? "submit" : "save change";

  return (
    <form
      id="add-todo-form"
      onSubmit={handleSubmit}
      autoComplete="off"
      ref={formRef}
    >
      <input
        disabled={loading}
        ref={inputRef}
        type="text"
        name="todo-name"
        id="todo-name"
        placeholder="todo name..."
      />

      <button ref={btnRef} id="submit-btn" disabled={loading}>
        {loading ? "loading..." : btnContent}
      </button>
    </form>
  );
});
export default AddTaskForm;
