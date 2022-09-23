import {createApp} from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/module/route.js'

const app = createApp(App);

app.use(router).use(ElementPlus).mount("#app");
