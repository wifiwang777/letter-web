import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [{
    path: '/', redirect: '/index'
}, {
    path: '/login', name: 'login', component: () => import('@/view/login/index.vue')
}, {
    path: '/index', name: 'index', component: () => import('@/view/index/index.vue')
}]

const router = createRouter({
    history: createWebHashHistory(), routes
})

router.beforeEach(async (to, from) => {
    if (window.localStorage.getItem("token") === null && to.name !== 'login') {
        // 将用户重定向到登录页面
        return {name: 'login'}
    }
    if (window.localStorage.getItem("token") !== null && to.name === 'login') {
        // 将用户重定向到主页
        return {name: 'index'}
    }
})

export default router
