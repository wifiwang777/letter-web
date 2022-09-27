<script>
import router from "@/module/route.js";
import {login, register} from "@/api/user.js";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      name: "",
      password: "",
    }
  },
  methods: {
    async login() {
      if (this.name === "" || this.password === "") {
        alert("please insert username or password")
      } else {
        const res = await login(this.$data);
        if (res.data.code === 0) {
          window.localStorage.setItem("token", res.data.data)
          await router.push({name: "index"})
        } else {
          alert(res.data.msg);
        }
      }
    },
    async register() {
      if (this.name === "" || this.password === "") {
        ElMessage.error("please insert username or password")
      } else {
        let res = await register(this.$data);
        if (res.data.code === 0) {
          ElMessage.success("register success")
        } else {
          ElMessage.warning(res.data.msg)
        }
      }
    }
  }
}
</script>

<template>
  <div class="card">
    username: <input id="name" v-model="name"/><br/>
    password: <input id="password" v-model="password"/><br/>
    <button type="button" @click="login">Login</button>
    <button type="button" @click="register">Register</button>
  </div>
</template>
