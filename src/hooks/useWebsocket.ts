import { useEffect, useState, useRef } from 'react'
import { parseMessage } from 'helpers/parseMessage'
import { updateOrders, updateTotals, groupOrders } from 'helpers/orders'

export type Product = 'PI_XBTUSD' | 'PI_ETHUSD'
export type Action = 'subscribe' | 'unsubscribe'
export type Order = [
  price: number,
  size: number,
  total?: number,
  percentage?: number,
]
export type OrderGroup = { orders: Order[]; grouped: Order[] }
type Status =
  | 'initializing'
  | 'open'
  | 'closed'
  | 'error'
  | 'subscribed'
  | 'unsubscribed'

export const SOCKET_URL = 'wss://www.cryptofacilities.com/ws/v1'

export function useWebsocket(groupSize: string) {
  const ws = useRef<WebSocket>(null)
  const [event, setEvent] = useState<MessageEvent>()
  const [status, setStatus] = useState<Status>('initializing')
  const [productId, setProductId] = useState<Product>('PI_XBTUSD')
  const [bids, setBids] = useState<{ orders: Order[]; grouped: Order[] }>({
    orders: [],
    grouped: [],
  })
  const [asks, setAsks] = useState<{ orders: Order[]; grouped: Order[] }>({
    orders: [],
    grouped: [],
  })

  /* Initialize Websocket */
  useEffect(() => {
    ws.current = new WebSocket(SOCKET_URL)
    ws.current.onopen = () => setStatus('open')
    ws.current.onclose = () => setStatus('closed')
    ws.current.onmessage = (e: MessageEvent) => setEvent(e)
    ws.current.onerror = (e) => {
      try {
        throw Error(e.toString())
      } catch (err) {
        setStatus('error')
        console.log(err)
      }
    }

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
      case 'error':
        ws.current.send(subEvent('unsubscribe', productId))
        break
    }
  }, [status, productId])

  /** Auto clear the bids and asks if the group size changes */
  useEffect(() => {
    const clear = { orders: [], grouped: [] }
    setBids(clear)
    setAsks(clear)
  }, [groupSize])

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
    if (message.event === 'unsubscribed' && status !== 'error') {
      setStatus('unsubscribed')
      const clear = { orders: [], grouped: [] }
      setBids(clear)
      setAsks(clear)
      return
    }

    // update state
    function update(
      orders: Order[],
      updates: Order[],
      groupSize: string,
      sort?: 'asc' | 'desc',
    ) {
      orders = updateOrders(orders, updates, sort)
      orders = updateTotals(orders)
      return { orders, grouped: groupOrders(orders, groupSize) }
    }

    // Order Updates
    if (message.asks?.length) {
      setAsks(({ orders }) => update(orders, message.asks, groupSize, 'desc'))
    }
    if (message.bids?.length) {
      setBids(({ orders }) => update(orders, message.bids, groupSize, 'asc'))
    }
  }, [event, groupSize, status])

  return { ws, productId, status, bids, asks }
}

export const subEvent = (event: Action, productId: Product) =>
  JSON.stringify({
    event,
    feed: 'book_ui_1',
    product_ids: [productId],
  })
