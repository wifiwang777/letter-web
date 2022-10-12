import {getUserInfo} from "@/api/user.js";

let userinfo = {
    uid: 0,
    name: "",
    avatar: ""
};

export const clearUserInfo = () => {
    userinfo = {
        uid: 0,
        name: "",
        avatar: ""
    }
}

export const setUserInfo = async () => {
    let res = await getUserInfo();
    if (res.data.code === 0) {
        userinfo.uid = res.data.data.uid;
        userinfo.name = res.data.data.name;
        userinfo.avatar = res.data.data.avatar;
    }
}


export const userInfo = async () => {
    if (userinfo.name !== "" && userinfo.uid !== 0) {
        return userinfo
    } else {
        await setUserInfo()
        return userinfo;
    }
}
