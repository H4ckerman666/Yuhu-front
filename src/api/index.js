import axios from "axios";

export default axios.create({
  baseURL: "http://18.116.26.70:8000/api/tasks/",
  // baseURL: "http://127.0.0.1:8000/api/tasks/",
  headers: {
    "Content-Type": "application/json",
  },
});