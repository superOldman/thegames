/* eslint-disable no-undef */
const prefix = 'chat'
export const socketApi = ['message', 'newuser', 'roomusers', 'leavemessage']
export function chatListeners(socket) {
  for (let index = 0; index < socketApi.length; index++) {
    const event = `${prefix}_${socketApi[index]}`
    socket.on(event, data => {
      $game_bus.$emit('bus_' + event, data)
    })

    $game_bus.$on(event, data => {
      socket.emit(event, data)
    })
  }
}