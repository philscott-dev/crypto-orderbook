type Order = [price: number, size: number]

type Message = {
  event?: 'info' | 'subscribed' | 'unsubscribed'
  feed?: 'book_ui_1' | 'book_ui_1_snapshot'
  version?: number
  product_ids?: ['PI_XBTUSD'] | ['PI_ETHUSD']
  product_id?: 'PI_XBTUSD' | 'PI_ETHUSD'
  asks?: Order[]
  bids?: Order[]
  numLevels?: number
}

export function parseMessage(e: MessageEvent): Message {
  return JSON.parse(e.data) as Message
}
