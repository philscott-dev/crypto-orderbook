import { OrderGroup, Order } from 'hooks/useWebsocket'
import { groupOrders } from './groupOrders'
interface UpdateOrdersOptions {
  orders: Order[]
  updates: Order[]
  groupSize: string
}

export function updateOrders({
  orders,
  updates,
  groupSize,
}: UpdateOrdersOptions): OrderGroup {
  for (const [price, size] of updates) {
    const index = orders.findIndex((ask) => ask[0] === price)

    // ignore non-existant results
    if (index < 0 && size === 0) {
    }

    // remove the price level
    else if (size === 0) {
      orders = [...orders.slice(0, index), ...orders.slice(index + 1)]
    }

    // add a new price level
    else if (index < 0) {
      orders = [...orders, [price, size]]
    }

    // overwrite the exisitng price level
    else {
      orders = [
        ...orders.slice(0, index),
        [price, size],
        ...orders.slice(index + 1),
      ]
    }
  }

  // Sort
  orders = orders.sort((a, b) => a[0] - b[0])

  // Accumulate Total
  orders = orders.reduce<Order[]>((acc, item, i) => {
    const [price, size] = item

    // get the previous total
    const prev = acc[i - 1]
    const nextTotal = prev ? prev[2] + size : size
    return [...acc, [price, size, nextTotal]]
  }, [])

  // get last items total as the grand total
  const grandTotal = orders[orders.length - 1]
    ? orders[orders.length - 1][2]
    : 0

  // use the grandtotal
  const grouped = groupOrders(orders, groupSize).map((order) => {
    const [price, size, total] = order
    const o: Order = [price, size, total, (total / grandTotal) * 100]
    return o
  })
  // generate percentage
  // orders = orders.map((order) => {
  //   const [price, size, total] = order
  //   return [price, size, total, (order[2] / last[2]) * 100]
  // })

  return { orders, grouped }
}
