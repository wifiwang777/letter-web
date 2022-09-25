import axios from "axios";

export const host = "192.168.1.3"

const service = axios.create({
    baseURL: "http://" + host + ":8085"
})

service.interceptors.request.use(config => {
    config.headers = {
        "x-token": window.localStorage.getItem("token")
    }
    return config
})

export default service
