<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px">
        <el-collapse>
          <el-input v-model="searchArea" placeholder="搜索好友" style="width: 85%"/>
          <el-button :icon="Search" circle @click="searchFriend"/>
        </el-collapse>
        <el-table ref="searchTable" :data="searchTableData" border style="width: 100%" :hidden="searchTableHidden">
          <el-table-column prop="uid" label="Date"/>
          <el-table-column prop="name" label="Name"/>
          <el-table-column label="操作">
            <el-button type="primary" @click="addFriend">添加</el-button>
          </el-table-column>
        </el-table>
        <el-table
            :data="friends"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @cell-click="tableRowClick"
        >
          <el-table-column prop="name" itemid="uid" label="好友列表" width="280px" @click="tableRowClick"
                           align="center"/>
        </el-table>
      </el-aside>

      <el-container>
        <el-header>
          {{ currentFriend.name }}
        </el-header>

        <el-main>
          <el-scrollbar ref="scrollbarRef" max-height="400px" always>
            <p v-for="message in messages" :key="message" class="scrollbar-demo-item">
              <span v-if="message.fromUserId===currentFriend.uid">
                 {{ currentFriend.name }}:
              </span>
              <span v-else>
              我:
              </span>
              {{ message.createAt }}<br/>
              {{ message.content }}
            </p>
          </el-scrollbar>
        </el-main>

        <el-footer>
          <el-input
              v-model="textarea"
              :rows="8"
              type="textarea"
              placeholder="Please input"
          />
          <el-button type="success" round @click="sendMessage">发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {Search} from "@element-plus/icons-vue"
</script>

<script>
import {getFriends, searchUser} from "@/api/user.js"
import {getMessages} from "@/api/messages.js"
import {ref} from "vue";
import {decodeMessage, encodeMessage} from "@/pb/message.js";
import {getUserinfo} from "@/module/user.js";

let ws = null;
export default {
  data() {
    return {
      textarea: "",
      searchArea: "",
      searchTableHidden: true,
      searchTableData: ref([]),
      currentFriend: {
        uid: 0,
        name: ""
      },
      friends: ref([]),
      messages: ref([]),

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
      if (ws != null) {
        return
      }
      await this.connectWebsocket()
    },
    async searchFriend() {
      let userInfo = await getUserinfo()
      this.searchTableData = [];
      let res = await searchUser(this.searchArea)
      if (res.data.code === 0) {
        this.searchTableHidden = false;
        let searchRes = res.data.data
        let searchLen = searchRes.length

        for (let i = 0; i < searchLen; i++) {
          if (searchRes[i].name !== userInfo.name) {
            this.searchTableData = [
              ...this.searchTableData,
              {
                uid: searchRes[i].uid,
                name: searchRes[i].name,
              }
            ];
          }
        }
      }
    },
    async addFriend() {
      console.log(this.$refs.searchTable.getSelectionRows());
    },
    async connectWebsocket() {
      let userinfo = await getUserinfo()
      const wsUrl = "ws://localhost:8086/letter/ws?uid=" + userinfo.uid;
      // 实例化 WebSocket
      ws = new WebSocket(wsUrl);
      // 监听 WebSocket 连接
      ws.onopen = function () {

      }
      // 监听 WebSocket 错误信息
      ws.onerror = (message) => {
        console.log(message)
      }
      // 监听 WebSocket 消息
      ws.onmessage = (message) => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(message.data);
        reader.onload = (
            (event) => {
              let messagePB = decodeMessage(new Uint8Array(event.target.result))
              this.messages = [
                ...this.messages,
                {
                  fromUserId: messagePB.from,
                  toUserId: messagePB.to,
                  content: messagePB.content,
                  createAt: new Date().toLocaleString()
                }
              ]
            }
        )
      }
      ws.onclose = (message) => {
        console.log("close " + message)
      }
    },
    async sendMessage() {
      let userinfo = await getUserinfo()
      let data = {
        from: userinfo.uid,
        to: this.currentFriend.uid,
        type: 1,
        content: this.textarea
      }
      this.messages = [
        ...this.messages,
        {
          fromUserId: data.from,
          toUserId: data.to,
          content: data.content,
          createAt: new Date().toLocaleString()
        }
      ]
      let pb = encodeMessage(data)
      ws.send(pb);
    },
    scrollToEnd() {
      this.$nextTick(() => {
        this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrap$.scrollHeight);
      })
    }
  },
  async mounted() {
    let res = await getFriends()
    if (res.data.code === 0) {
      this.friends = res.data.data
    }
  },
  watch: {
    messages(newName, oldName) {
      this.scrollToEnd();
    }
  },
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
