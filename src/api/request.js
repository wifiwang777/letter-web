import axios from "axios";

const ip = window.location.hostname
export const apiUrl = "http://" + ip + ":8085"
export const websocketUrl = "ws://" + ip + ":8086"

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
