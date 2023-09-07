<template>
  <div>
    <chat @gameStart="gameStart" />
    <div ref="board" id="board"></div>
  </div>
</template>

<script>
import chat from '@/views/chat/chat'
export default {
  name: 'fiveChess',
  components: {
    chat
  },
  props: {

  },
  data() {
    return {
      myCamp: '',
      nowCamp: ''
    }
  },
  mounted() {
  },
  methods: {
    gameStart(camp) {
      this.myCamp = camp
      this.nowCamp = 'black'
      this.initBoard()
      $game_bus.$on('bus_fivechess_movechess', this.drawChess)
    },
    refreshBoard() {
      this.$refs.board.replaceChildren()
      this.initBoard()
    },
    initBoard() {
      const defaultoption = {
        w: 20,
        h: 20
      }
      const fragment = document.createDocumentFragment()
      for (let i = 0; i < defaultoption.w; i++) {
        for (let j = 0; j < defaultoption.h; j++) {
          const box = document.createElement('div')
          // 方便查找
          box.className = `${i + 1},${j + 1}`
          box.onclick = this.movechess
          fragment.appendChild(box)
        }
      }
      this.$refs.board.appendChild(fragment)
    },
    movechess(e) {
      if (this.nowCamp === this.myCamp) {
        $game_bus.$emit('fivechess_movechess', {
          className: e.target.className,
          camp: this.myCamp
        })
      } else {
        this.$message.warning('还没到你')
      }
    },

    drawChess({ className, camp }) {
      const box = document.getElementsByClassName(className)[0]
      const full = box.getAttribute('full')
      if (!full) {
        box.setAttribute('full', camp)
        const chess = document.createElement('div')
        chess.className = camp
        box.appendChild(chess)
        this.nowCamp = camp === 'black' ? 'white' : 'black'
        setTimeout(() => this.checkWin(box, camp))
      }
    },
    checkWin(box, camp) {
      const className = box.className
      const [y, x] = className.split(',')

      let count = 1
      const directions = [
        [-1, 0], [-1, 1], [0, 1], [1, 1],
        [1, 0], [1, -1], [0, -1], [-1, -1]
      ]
      for (const [dx, dy] of directions) {
        for (let i = 1; i < 5; i++) {
          const newX = x + i * dx;
          const newY = y + i * dy;
          const dom = document.getElementsByClassName(`${newY},${newX}`)[0]
          if (dom && dom.getAttribute('full') === camp) {
            count++
          } else {
            break
          }
        }
        // if (count >= 5) {
        //   alert(camp + '赢了')
        //   return true;
        // }
        for (let i = 1; i < 5; i++) {
          const newX = x - i * dx;
          const newY = y - i * dy;
          const dom = document.getElementsByClassName(`${newY},${newX}`)[0]
          if (dom && dom.getAttribute('full') === camp) {
            count++
          } else {
            break
          }
        }
        if (count >= 5) {
          alert(camp + '赢了')
          this.refreshBoard()
          return true
        }
      }
    }

  }
}
</script>

<style  lang="css">
#board {
  width: 800px;
  display: flex;
  flex-wrap: wrap;
}

#board > div {
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
}

.white {
  border: 1px solid #000;
  border-radius: 50%;
  width: 80% !important;
  height: 80% !important;
  background-color: #fff;
}

.black {
  border: 1px solid #000;
  border-radius: 50%;
  width: 80% !important;
  height: 80% !important;
  background-color: #000;
}
</style>
