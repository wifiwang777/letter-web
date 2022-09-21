<template>
  <div> index</div>
  <div>
    <button type="button" @click="logOut">log out</button>
  </div>
</template>

<script>
import user from '@/view/login/index.vue'
import router from "@/router/index.js";

export default {
  name: "index",
  methods: {
    logOut() {
      user.data().token = ""
      user.data().name = ""
      user.data().password = ""
      router.push({path: "/"})
    }
  }
}
</script>

<style scoped>

</style>
