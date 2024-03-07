// react
import { useEffect, useState, useRef } from "react";

// redux
import { useSelector } from "react-redux";
import useDispatch from "./hooks/useDispatch";
import { RootState } from "./store/store";

// actions
import { setTodos } from "./store/features/todosSlice";

// component
import TodosList from "./components/todos/TodosList";
import AddTaskForm from "./components/AddTaskForm";

import { axiosGet } from "./axios";

// types
import { FormRefType } from "./components/AddTaskForm";

const App = () => {
  const formRef = useRef<FormRefType>(null);
  const [loading, setLoading] = useState(false);

  const { todos } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const getTodos = async () => {
    try {
      setLoading(true);
      const res = await axiosGet.get("/");

      setLoading(false);

      dispatch(setTodos(res.data));
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const showTodos = !todos.length ? (
    <h2 className="no-todos-msg">no todos to show.</h2>
  ) : (
    <TodosList todos={todos} formRef={formRef} />
  );

  return (
    <>
      <h1 id="app-title">
        To do list app <br />
        <div>
          with{" "}
          <img src="https://axios-http.com/assets/logo.svg" alt="axios-logo" />
        </div>
      </h1>

      <div className="warn">
        when opening the app for first time or from a long time, fetching todos
        will take one minute or more.
      </div>

      <AddTaskForm ref={formRef} />

      {loading ? "loading..." : showTodos}
    </>
  );
};

export default App;
