import { io } from "socket.io-client"
import { chatListeners } from '@/service/chatSocket'
import fivechessSocket from "./fivechessSocket"
let socket = null

// 建立socket连接
function createSocket() {
  if (socket) return socket
  const url = process.env.VUE_APP_BASE_SOCKET 
  // const url = 'http://sicilymarmot.top:3999/'
  return socket = io(url, {
    path: '/socket.io',
    query: {},
    reconnectionDelayMax: 10000,
    transports: ['websocket']
  })
}

/**
 * @Description: 断开socket连接
 * @name: disconnect
 * @param {*}
 * @return {*}
 */
export function disconnect(sk) {
  sk = sk || socket
  sk.close()
}

export function initSocket() {
  const socket = createSocket()
  let retryCount = 0

  //监听连接是否成功
  socket.on('connect', () => {
    console.log('connect')
    window.TemporaryID = socket.id
  })

  //监听连接异常中断
  socket.on('disconnect', (reason) => {
    console.log(reason);
  })

  // 重连
  socket.on('connect_error', () => {
    retryCount++
    //关闭连按
    socket.close()
    setTimeout(() => {
      socket.connect()
    }, 10000)
  })

  chatListeners(socket)
  fivechessSocket(socket)
}



