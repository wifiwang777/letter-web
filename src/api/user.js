import service from '@/api/request';

export const getUserInfo = function () {
    return service({
        url: "user/info",
        method: 'get'
    });
}

export const login = function (data) {
    return service({
        url: "/login",
        method: 'post',
        data: data
    })
}

export const register = function (data) {
    return service({
        url: "/register",
        method: 'post',
        data: data
    })
}

export const getFriends = function () {
    return service({
        url: "user/getFriends",
        method: 'get'
    })
}

export const searchUser = function (name) {
    return service({
        url: "user/searchUser?name=" + name,
        method: 'get'
    })
}

export const deleteFriend = function (uid) {
    return service({
        url: "user/deleteFriend",
        method: 'post',
        data: {"uid": uid}
    })
}

export const addFriend = function (data) {
    return service({
        url: "user/addFriend",
        method: 'post',
        data: data
    })
}


export const acceptFriend = function (data) {
    return service({
        url: "user/acceptFriend",
        method: 'post',
        data: data
    })
}
