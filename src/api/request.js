import axios from "axios";

const service = axios.create({
    baseURL: "http://localhost:8085"
})

service.interceptors.request.use(config => {
    config.headers = {
        "x-token": window.localStorage.getItem("token")
    }
    return config
})

export default service
