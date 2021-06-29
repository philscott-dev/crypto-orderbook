import { useEffect, useState, useRef } from 'react'
import { parseMessage } from 'helpers/parseMessage'
import { updateOrders } from 'helpers/updateOrders'

export type Product = 'PI_XBTUSD' | 'PI_ETHUSD'
export type Action = 'subscribe' | 'unsubscribe'
export type Order = [
  price: number,
  size: number,
  total?: number,
  percentage?: number,
]
export type OrderGroup = [orders: Order[], grouped: Order[]]
type Status =
  | 'initializing'
  | 'open'
  | 'closed'
  | 'error'
  | 'subscribed'
  | 'unsubscribed'

export const subEvent = (event: Action, productId: Product) =>
  JSON.stringify({
    event,
    feed: 'book_ui_1',
    product_ids: [productId],
  })

export function useWebsocket(groupSize: string) {
  const ws = useRef<WebSocket>(null)
  const [event, setEvent] = useState<MessageEvent>()
  const [status, setStatus] = useState<Status>('initializing')
  const [productId, setProductId] = useState<Product>('PI_XBTUSD')
  const [bids, setBids] = useState<Order[]>([])
  const [asks, setAsks] = useState<Order[]>([])

  /* Initialize Websocket */
  useEffect(() => {
    ws.current = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
    ws.current.onopen = () => setStatus('open')
    ws.current.onclose = () => setStatus('closed')
    ws.current.onerror = () => setStatus('error')
    ws.current.onmessage = (e: MessageEvent) => setEvent(e)

    return () => {
      ws.current.close()
    }
  }, [])

  /* Handle Events */
  useEffect(() => {
    switch (status) {
      case 'open':
        ws.current.send(subEvent('subscribe', 'PI_XBTUSD'))
        break
      case 'unsubscribed':
        const id = productId === 'PI_XBTUSD' ? 'PI_ETHUSD' : 'PI_XBTUSD'
        ws.current.send(subEvent('subscribe', id))
        break
    }
  }, [status, productId])

  /* Handle Messages */
  useEffect(() => {
    if (!event) return
    const message = parseMessage(event)

    // Subscribe
    if (message.event === 'subscribed') {
      setProductId(message.product_ids[0])
      setStatus('subscribed')
      return
    }

    // Unsubscribe
    if (message.event === 'unsubscribed') {
      setStatus('unsubscribed')
      setBids([])
      setAsks([])
      return
    }

    // Order Updates
    if (message.asks?.length) {
      setAsks((prev) =>
        updateOrders({ orders: prev, updates: message.asks, groupSize }),
      )
    }
    if (message.bids?.length) {
      setBids((prev) =>
        updateOrders({ orders: prev, updates: message.bids, groupSize }),
      )
    }
  }, [event, groupSize])

  return { ws, productId, bids, asks }
}
