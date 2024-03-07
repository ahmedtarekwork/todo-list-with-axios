import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../../types";

type initState = {
  todos: Todo[];
};

const initialState: initState = {
  todos: [],
};

const todoSlice = createSlice({
  initialState,
  name: "todos",
  reducers: {
    setTodos: (state, { payload }: PayloadAction<Todo[]>) => {
      state.todos = payload;
    },

    resetTodos: (state) => {
      state.todos = [];
    },

    addTodo: (state, { payload }: PayloadAction<Todo>) => {
      state.todos = [...state.todos, payload];
    },

    removeTodo: (state, { payload }: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo._id !== payload);
    },

    editTodo: (state, { payload }: PayloadAction<Todo>) => {
      state.todos = state.todos.map((todo) =>
        todo._id === payload._id ? payload : todo
      );
    },
  },
});

export const { addTodo, editTodo, removeTodo, resetTodos, setTodos } =
  todoSlice.actions;

export default todoSlice.reducer;
