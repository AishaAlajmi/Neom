import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1:8000", // use localhost while testing webcam
  timeout: 10000,
});
