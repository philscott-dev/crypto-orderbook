import { Order } from 'hooks/useWebsocket'
import { GROUP_SIZE } from 'contants/groupSize'

export function groupOrders(orders: Order[], groupSize: string): Order[] {
  // dont process the default group sizes
  if (GROUP_SIZE.XBT[0] === groupSize || GROUP_SIZE.ETH[0] === groupSize) {
    return orders
  }

  return orders.reduce((acc, order, i) => {
    const [price, size, total] = order
    const [prevPrice, prevSize, prevTotal] = acc[acc.length - 1] || []

    const roundedPrice = roundFloat(price, Number(groupSize))

    if (roundedPrice !== prevPrice) {
      return [...acc, [roundedPrice, size, total]]
    }

    return [
      ...acc.slice(0, acc.length - 1),
      [roundedPrice, prevSize + size, prevTotal + size],
    ]
  }, [])
}

function roundFloat(value: number, toNearest: number, fixed = 2) {
  return (Math.ceil(value / toNearest) * toNearest).toFixed(fixed)
}
