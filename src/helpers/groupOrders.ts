import { Order } from 'hooks/useWebsocket'
import { GROUP_SIZE } from 'contants/groupSize'

export function groupOrders(orders: Order[], groupSize: string) {
  if (groupSize === GROUP_SIZE.XBT[0] || groupSize === GROUP_SIZE.ETH[0]) {
    return orders
  }

  return orders.reduce((acc, order, i) => {
    const [price, size] = order
    const prev = acc[i - 1] || []

    const rounded = roundFloat(price, Number(groupSize))
    if (price !== prev[0]) {
      return [...acc, [rounded, size]]
    }

    return [...acc.slice(0, i + 1), [rounded, size + prev[1] || 0]]
  }, [])
}

function roundFloat(value: number, toNearest: number, fixed = 2) {
  return (Math.ceil(value / toNearest) * toNearest).toFixed(fixed)
}
