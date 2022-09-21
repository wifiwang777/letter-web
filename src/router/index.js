import {createRouter, createWebHashHistory} from 'vue-router'
import user from '@/view/login/index.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/view/login/index.vue')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('@/view/index/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, from) => {
    if (user.data().token === '' && to.name !== 'login') {
        console.log("enter")
        // 将用户重定向到登录页面
        return {name: 'login'}
    }
})

export default router
