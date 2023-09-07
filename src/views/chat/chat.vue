<template>
  <div>
    <div class="fx">
      创建名字
      <input v-model="myName" type="text">
      <button @click="clickHandle">创建名字</button>
    </div>
    <div class="msgList"></div>
    <div class="chatroom">
      <div class="fx" v-for="(item,i) in msgList" :key="i">
        <template v-if="item.type==='msg'">
          <div class="fx-none">{{item.name}}</div>
          <div class="fx-full">{{item.msg}}</div>
        </template>
        <template v-if="item.type==='system'">
          <div>{{item.msg}}</div>
        </template>
      </div>
    </div>
    <el-button type="primary" @click="startHandle">开始</el-button>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div v-for="(item,i) in selectedList" :key="i">
        <div class="fx">
          <div>{{item.name}}</div>
          <el-radio-group v-model="item.camp" :disabled="item.id!==myId" @change="e=>selcetComp(e,item)">
            <el-radio label="black">黑</el-radio>
            <el-radio label="white">白</el-radio>
          </el-radio-group>

          <div v-if="item.ready">准备好了</div>
          <el-button v-else-if="item.id==myId" type="primary" @click="acceptHandle">确 定</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="turnDown">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'chatComp',
  components: {

  },
  props: {

  },
  data() {
    return {
      myName: 'kimi',
      myId: '',
      msgList: [],

      selectedList: [],
      dialogVisible: false
    }
  },
  mounted() {
    this.listenSocket()
  },
  methods: {

    clickHandle() {
      if (this.myId) {
        alert('你已经加入了房间')
        return
      } else {
        if (this.myName) {
          $game_bus.$emit('chat_newuser', this.myName)
        }
      }
    },

    listenSocket() {
      $game_bus.$on('bus_chat_message', data => {
        this.msgList.push({ type: 'msg', name: data.name, msg: data.msg, id: data.id })
      });
      $game_bus.$on('bus_chat_newuser', data => {
        if (!this.myId && window.TemporaryID === data.id) {
          this.myId = data.id
        }
        this.msgList.push({ type: 'system', msg: '用户：' + data.name + '加入聊天' })
      })
      //  $game_bus.$on('room users', data => {
      //   room.innerText = JSON.stringify(data)
      // })
      $game_bus.$on('bus_chat_leavemessage', data => {
        this.msgList.push({ type: 'system', msg: data.msg })
      })

      // 邀请
      $game_bus.$on('bus_fivechess_invite', data => {
        this.dialogVisible = true
        this.selectedList = data
      })

      $game_bus.$on('bus_fivechess_accept', data => {
        this.selectedList.forEach(e => {
          if (e.id === data.id) {
            this.$set(e, 'ready', true)
          }
        })

        if (this.selectedList.every(e => e.ready)) {
          this.dialogVisible = false
          this.msgList.push({ type: 'system', msg: '对局开始了' })
          this.$emit('gameStart', this.selectedList.find(e => e.id == this.myId).camp)
        }
      })

      $game_bus.$on('bus_fivechess_turndown', data => {
        this.dialogVisible = false
        if (data.id === this.myId) {
          this.msgList.push({ type: 'system', msg: '你取消了', id: data.id })
        } else {
          this.msgList.push({ type: 'system', msg: data.name + '拒绝了你', id: data.id })
        }
      })

      // 选边
      $game_bus.$on('bus_fivechess_selcetcamp', data => {
        this.selectedList = data
      })
    },
    selcetComp(e, item) {
      if (item.id === this.myId) {
        $game_bus.$emit('fivechess_selcetcamp', JSON.parse(JSON.stringify(this.selectedList)))
      }
    },
    startHandle() {
      if (this.myName) {
        $game_bus.$emit('fivechess_invite', { name: this.myName, id: this.myId })
      } else {
        alert('没有名字')
      }
    },
    acceptHandle() {
      if (this.selectedList.length == 2) {
        if (this.selectedList[0].camp !== this.selectedList[1].camp) {
          $game_bus.$emit('fivechess_accept', {
            name: this.myName,
            id: this.myId,
            camp: this.selectedList.find(e => e.id == this.myId).camp,
            ready: true
          })
        } else {
          this.$message.warning('不能都选一边')
        }
      }
      else {
        this.$message.warning('两个人才能开始')
      }
    },
    turnDown() {
      $game_bus.$emit('fivechess_turndown', {
        name: this.myName,
        id: this.myId
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
