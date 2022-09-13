<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      password: ""
    }
  },
  methods: {
    login() {
      if (this.name === "" || this.password === "") {
        alert("please insert username or password")
      } else {
        axios
            .post("http://localhost:8085/user/login", {
              name: this.name,
              password: this.password
            })
            .then(response => {
              console.log(response)
              if (response.data.code===0){
                alert("login success")
              }else{
                alert(response.data.msg);
              }
            })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
      }
    },
    register() {
      if (this.name === "" || this.password === "") {
        alert("please insert username or password")
      } else {
        axios
            .post("http://localhost:8085/user/register", {
              name: this.name,
              password: this.password
            })
            .then(response => {
              console.log(response)
              if (response.data.code===0){
                alert("register success")
              }else{
                alert(response.data.msg);
              }
            })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
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