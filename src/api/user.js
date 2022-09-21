import service from '@/api/request';

export const login = function (data) {
    return service({
        url: "/user/login",
        method: 'post',
        data: data
    })
}

export const register = function (data) {
    return service({
        url: "/user/register",
        method: 'post',
        data: data
    })
}
