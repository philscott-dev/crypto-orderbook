import { renderHook } from '@testing-library/react-hooks'
import { useWebsocket, SOCKET_URL } from 'hooks/useWebsocket'

// const waitForWebsocket = (socket: WebSocket) =>
//   new Promise<void>((resolve) => {
//     const originalFn = socket.onopen.bind(socket)
//     socket.onopen = (e: MessageEvent) => {
//       originalFn(e)
//       resolve()
//     }
//   })

describe('useWebsocket', () => {
  it('should create a websocket with the correct URL', () => {
    const { result } = renderHook(() => useWebsocket('0.5'))
    const { ws } = result.current
    expect(ws.current.url).toBe(SOCKET_URL)
  })
})
