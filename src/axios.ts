import Axios from "axios";
import { Todo } from "./types";

type ServerTodo = Pick<Todo, "_id"> & {
  title?: string;
  completed?: Todo["checked"];
};

// for coming respone
const convertServerToLocalTodo = (todo: ServerTodo) => {
  const finalTodo = { ...todo, todo: todo.title, checked: todo.completed };
  delete finalTodo.title;
  delete finalTodo.completed;

  return finalTodo;
};

const config = {
  baseURL: "https://to-do-list-api-auz9.onrender.com/api/tasks",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const axiosGet = Axios.create({
  ...config,
  transformResponse: [
    (data) => {
      return JSON.parse(data).map((todo: ServerTodo) =>
        convertServerToLocalTodo(todo)
      );
    },
  ],
});

export const axiosPost = Axios.create({
  ...config,

  transformResponse: [
    (data) => {
      return convertServerToLocalTodo(JSON.parse(data));
    },
  ],
});

export default Axios.create(config);
