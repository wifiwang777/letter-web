import {getUserInfo} from "@/api/user.js";

const userinfo = {
    uid: 0,
    name: ""
};

export const setUserInfo = async () => {
    let res = await getUserInfo();
    if (res.data.code === 0) {
        userinfo.uid = res.data.data.uid;
        userinfo.name = res.data.data.name;
    }
}


export const getUserinfo = async () => {
    if (userinfo.name !== "" && userinfo.uid !== 0) {
        return userinfo
    } else {
        await setUserInfo()
        return userinfo;
    }
}
