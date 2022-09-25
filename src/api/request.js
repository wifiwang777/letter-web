import axios from "axios";

export const apiUrl = "http://192.168.1.3:8085"
export const websocketUrl = "ws://192.168.1.3:8086"

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
