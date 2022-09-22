import service from '@/api/request';

export const getMessages = function (data) {
    return service({
        url: "/messages?uid=" + data,
        method: 'get',
    })
}
