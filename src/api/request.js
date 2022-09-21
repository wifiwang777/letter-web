import axios from "axios";

const service = axios.create({
    baseURL: "http://localhost:8085"
})

export default service
