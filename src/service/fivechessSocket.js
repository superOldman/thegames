/* eslint-disable no-undef */
export default function (socket) {
  const prefix = 'fivechess'

  const socketApi = ['invite', 'accept', 'turndown', 'selcetcamp', 'movechess' ]

  for (let index = 0; index < socketApi.length; index++) {
    const event = `${prefix}_${socketApi[index]}`
    socket.on(event, data => $game_bus.$emit('bus_' + event, data))
    $game_bus.$on(event, data => socket.emit(event, data))
  }
}