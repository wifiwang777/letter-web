import axios from "axios";

export const apiUrl = "http://localhost:8085"
export const websocketUrl = "ws://localhost:8086"

const service = axios.create({
    baseURL: apiUrl
})

service.interceptors.request.use(config => {
    config.headers = {
        "x-token": window.localStorage.getItem("token")
    }
    return config
})

export default service
