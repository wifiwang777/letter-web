<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="32%" style="border-width: 1px">
        <el-popover
            placement="bottom"
            trigger="click"
            :width="300"
        >
          <template #reference>
            <el-avatar :src="getAvatar(user)" size="default"/>
          </template>
          <template #default>
            <div style="width: 400px">
              <div style="display:flex; align-items: center;">
                <span>用户名: {{ user.name }}</span>
                <el-avatar style="margin-left: 35%" :src="getAvatar(user)" size="default" @click="showImageView=true"/>
                <el-dialog append-to-body="append-to-body" v-model="showImageView" width="77%"
                           @close="showImageView=false">
                  <img w-full :src="getAvatar(user)" alt="Preview Image"/>
                </el-dialog>
              </div>
              <div>
                更换头像：
                <el-upload
                    ref="uploadRef"
                    list-type="picture-card"
                    :auto-upload="false"
                    :action="apiUrl+'/file'"
                    :headers="{'x-token': user.token}"
                    :limit="1"
                    :on-change="setHaveFile"
                >
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                  <template #file="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                  </template>
                </el-upload>
                <el-button type="primary" round @click="uploadAvatar">提交</el-button>
              </div>
            </div>
          </template>
        </el-popover>

        <el-collapse>
          <el-input v-model="searchArea" placeholder="搜索好友" @keydown.enter.native="searchFriend"
                    style="width: 85%"/>
          <el-button :icon="Search" circle @click="searchFriend"/>
        </el-collapse>
        <el-table ref="searchTable" :data="searchTableData" border style="width: 100%" :hidden="searchTableHidden">
          <el-table-column prop="uid" label="Uid" v-if="false"/>
          <el-table-column prop="name" label="Name"/>
          <el-table-column label="" slot="">
            <template #default="scope">
              <el-avatar :src="getAvatar(scope.row)" size="default"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" slot="">
            <template #default="scope">
              <el-button type="primary" @click="newFriend(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
            :data="friends"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @cell-click="tableRowClick"
        >
          <el-table-column prop="name" itemid="uid" label="好友列表" align="center">
            <template #default="scope">
              <div style="font-size: 20px; display:flex; align-items: center; margin-left: 40%">
                <el-avatar :src="getAvatar(scope.row)" size="default"/>&nbsp;
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="" width="80">
            <template #default="scope">
              <el-popconfirm title="确定要删除吗?" @confirm="mDeleteFriend(scope.row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle/>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
        <el-button @click="logOut">退出</el-button>
      </el-aside>

      <el-container>
        <el-header>
          当前聊天:{{ currentFriend.name }}
        </el-header>

        <el-main>
          <el-scrollbar ref="scrollbarRef" max-height="400px" always>
            <teleport to="body">
              <el-dialog
                  v-model="showFriendImageView"
                  width="77%"
                  @close="showFriendImageView=false"
              >
                <img w-full :src="getAvatar(currentFriend)" alt="Preview Image"/>
              </el-dialog>
            </teleport>
            <div v-for="message in messages" :key="message">
              <div v-if="message.fromUserId===currentFriend.uid">
                <div class="scrollbar-demo-item"
                     style="background-color: whitesmoke;width: 250px; text-align: center; margin-right: auto">
                  <el-popover
                      placement="bottom"
                      trigger="click"
                  >
                    <template #reference>
                      <el-avatar :src="getAvatar(currentFriend)" size="default"/>
                    </template>
                    <div style="display:flex; align-items: center;">
                      <span>用户名: {{ currentFriend.name }}</span>
                      <el-avatar style="margin-left: 10%" :src="getAvatar(currentFriend)" size="default"
                                 @click="showFriendImageView=true"/>
                    </div>
                  </el-popover>
                  <span style="font-size: smaller">{{ message.createAt }}</span> <br/>
                  <span v-for="line in message.content.split('\n')" :key="line">
                  {{ line }} <br/>
                  </span>
                </div>
              </div>
              <div v-else>
                <div class="scrollbar-demo-item"
                     style="background-color: #66CC99;width: 250px; text-align: center; margin-left: auto">
                  <el-avatar :src="getAvatar(user)" size="default"></el-avatar>

                  <span style="font-size: smaller">{{ message.createAt }}</span> <br/>
                  <span v-for="line in message.content.split('\n')" :key="line">
                  {{ line }} <br/>
                  </span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-main>

        <el-footer :hidden="currentFriend.uid===0">
          <el-input
              v-model="sendContent"
              :rows="5"
              type="textarea"
              placeholder="Please input"
              @keydown.enter.native="enter"
          />
          <el-button type="success" round @click="sendMessage">发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {Search, Delete, UploadFilled} from "@element-plus/icons-vue"
</script>

<script>
import {addFriend, deleteFriend, getFriends, searchUser, acceptFriend} from "@/api/user.js"
import {getMessages} from "@/api/messages.js"
import {ref} from "vue";
import {decodeMessage, decodeMessageType, encodeMessage, encodeMessageType} from "@/pb/message.js";
import {clearUserInfo, userInfo} from "@/module/user.js";
import {ElMessage, ElMessageBox} from "element-plus";
import route from "@/module/route.js";
import {websocketUrl, apiUrl} from "@/api/request.js";

const searchArea = ref("")
const sendContent = ref("")
let user = await userInfo()
let ws = null;
export default {
  data() {
    return {
      searchTableHidden: true,
      searchTableData: ref([]),
      currentFriend: {
        uid: 0,
        name: "",
        avatar: ""
      },
      friends: ref([]),
      newFriends: ref([]),
      messages: ref([]),
      showImageView: false,
      showFriendImageView: false,
      haveFile: false
    }
  },
  methods: {
    logOut() {
      window.localStorage.removeItem("token")
      clearUserInfo()
      route.push({name: "login"})
    },
    tableRowClassName({row}) {
      if (row.uid === this.currentFriend.uid) {
        return "ss";
      }
      return "scrollbar-demo-item"
    },
    async tableRowClick(row, column) {
      if (column.label !== "好友列表") {
        return
      }
      this.currentFriend = row
      let res = await getMessages(row.uid)
      if (res.data.code === 0) {
        this.messages = res.data.data
      }
    },
    async searchFriend() {
      let user = await userInfo()
      this.searchTableData = [];
      let res = await searchUser(searchArea.value)
      if (res.data.code === 0) {
        this.searchTableHidden = false;
        let searchRes = res.data.data
        let searchLen = searchRes.length

        for (let i = 0; i < searchLen; i++) {
          if (searchRes[i].name !== user.name) {
            this.searchTableData = [
              ...this.searchTableData,
              {
                uid: searchRes[i].uid,
                name: searchRes[i].name,
                avatar: searchRes[i].avatar
              }
            ];
          }
        }
      }
    },
    async getFriendList() {
      let res = await getFriends()
      if (res.data.code === 0) {
        this.friends = res.data.data
      }
    },
    async newFriend(row) {
      let res = await addFriend(row)
      if (res.data.code === 0) {
        ElMessage.success("sent make friend request")
        await this.getFriendList()
      } else {
        ElMessage.warning(res.data.msg)
      }
    },
    async mDeleteFriend(row) {
      console.log(row)
      let res = await deleteFriend(row.uid)
      if (res.data.code === 0) {
        ElMessage.success("deleteFriend success")
        await this.getFriendList()
      } else {
        ElMessage.warning(res.data.msg)
      }
    },
    async connectWebsocket() {
      let user = await userInfo()
      const wsUrl = websocketUrl + "/letter/ws/" + user.uid;
      ws = new WebSocket(wsUrl);
      ws.onopen = function () {
        console.log("ws connected!")
      }
      ws.onerror = (message) => {
        console.log(message)
      }
      ws.onmessage = (message) => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(message.data);
        reader.onload = (
            (event) => {
              let messagePB = decodeMessage(new Uint8Array(event.target.result))
              if (messagePB.type === decodeMessageType[encodeMessageType.Notify]) {
                ElMessageBox.confirm(
                    messagePB.content,
                    'Info',
                    {
                      confirmButtonText: 'OK',
                      cancelButtonText: 'Cancel',
                      type: 'info',
                    }
                ).then(() => {
                  acceptFriend({uid: messagePB.from}).then((res) => {
                    if (res.data.code === 0) {
                      ElMessage.success("add friend success")
                      this.getFriendList()
                    } else {
                      ElMessage.warning(res.data.msg)
                    }
                  })
                }).catch(() => {
                  ElMessage({
                    type: 'info',
                    message: 'add new friend canceled',
                  })
                })
                return;
              }

              if (messagePB.from !== this.currentFriend.uid) {
                return
              }
              let msg = {
                fromUserId: messagePB.from,
                toUserId: messagePB.to,
                content: messagePB.content,
                createAt: new Date().toLocaleString()
              }
              if (this.messages === null) {
                this.messages = [msg];
              } else {
                this.messages = [
                  ...this.messages,
                  msg
                ]
              }
            }
        )
      }
      ws.onclose = (message) => {
        console.log("close " + message)
      }
    },
    async sendMessage() {
      let user = await userInfo()
      let data = {
        from: user.uid,
        to: this.currentFriend.uid,
        type: encodeMessageType.Msg,
        content: sendContent.value
      }
      let msg = {
        fromUserId: data.from,
        toUserId: data.to,
        content: data.content,
        createAt: new Date().toLocaleString()
      }
      if (this.messages === null) {
        this.messages = [msg];
      } else {
        this.messages = [
          ...this.messages,
          msg
        ]
      }
      let pb = encodeMessage(data)
      ws.send(pb);
      sendContent.value = ""
    },
    scrollToEnd() {
      this.$nextTick(() => {
        this.$refs.scrollbarRef.setScrollTop(this.$refs.scrollbarRef.wrap$.scrollHeight);
      })
    },
    enter(e) {
      if (!e.shiftKey && e.keyCode === 13) {
        e.preventDefault()
        this.sendMessage()
      }
    },
    getAvatar(user) {
      return apiUrl + "/file/" + user.avatar
    },
    uploadAvatar() {
      if (!this.haveFile) {
        ElMessage.warning("please select file")
        return
      }
      this.$refs.uploadRef.submit()
      ElMessage.success("update avatar success")
    },
    setHaveFile(...file) {
      this.haveFile = true;
    }
  },
  async mounted() {
    await this.getFriendList();
    await this.connectWebsocket()
  },
  watch: {
    messages(newName, oldName) {
      this.scrollToEnd();
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
