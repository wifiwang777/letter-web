<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-input v-model="search" placeholder="搜索"/>
        <el-button type="primary" :icon="Search">Search</el-button>
        <br/>

        <el-table
            :data="friends"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @cell-click="tableRowClick"
        >
          <el-table-column prop="name" itemid="uid" label="好友列表" width="180" @click="tableRowClick"/>
        </el-table>
      </el-aside>

      <el-container>
        <el-header>
          {{ currentFriend.name }}
        </el-header>

        <el-main>
          <el-card class="box-card" style="height: 200px">
            <div v-for="message in messages" class="text item">
              <div v-if="message.fromUserId===currentFriend.uid">
                {{ currentFriend.name }}:
              </div>
              <div v-else>
                我:
              </div>
              {{ message.content }}
            </div>
          </el-card>
        </el-main>

        <el-footer>
          <el-input
              v-model="textarea"
              :rows="8"
              type="textarea"
              placeholder="Please input"
          />
          <el-button type="success" round @click="">发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {Search} from "@element-plus/icons-vue"
</script>

<script>
import {getFriends} from "@/api/user.js"
import {getMessages} from "@/api/messages.js"
import {ref} from "vue";

export default {
  data() {
    return {
      textarea: "",
      search: "",
      currentFriend: {
        uid: 0,
        name: ""
      },
      friends: ref([]),
      messages: ref([])
    }
  },
  methods: {
    tableRowClassName({row}) {
      if (row.uid === this.currentFriend.uid) {
        return "ss";
      }
      return 'scrollbar-demo-item'
    },
    async tableRowClick(row) {
      this.currentFriend = row
      let res = await getMessages(row.uid)
      if (res.data.code === 0) {
        this.messages = res.data.data
      }
    },
    async sendMessage() {

    }
  },
  async mounted() {
    let res = await getFriends()
    if (res.data.code === 0) {
      this.friends = res.data.data
    }
  }
}
</script>

<style>
.scrollbar-demo-item {
  align-items: center;
  justify-content: center;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: #909399;
}

.ss {
  align-items: center;
  justify-content: center;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: #409EFF;
}
</style>
