import { Order } from 'hooks/useWebsocket'
import { GROUP_SIZE } from 'contants/groupSize'

// Add, Replace, or Remove Orders
export function updateOrders(
  orders: Order[],
  updates: Order[],
  sort: 'asc' | 'desc' = 'asc',
) {
  for (const [price, size] of updates) {
    // check to see if the order exists
    const index = orders.findIndex((ask) => ask[0] === price)

    // order needs to be add at a new price level
    if (index < 0 && size > 0) {
      orders = [...orders, [price, size]]
    }

    // price level should be removed
    else if (index >= 0 && size === 0) {
      orders = [...orders.slice(0, index), ...orders.slice(index + 1)]
    }

    // overwrite the exisitng price level
    else if (index >= 0 && size > 0) {
      orders = [
        ...orders.slice(0, index),
        [price, size],
        ...orders.slice(index + 1),
      ]
    }
  }

  // sort by price and return
  return orders.sort((a, b) => (sort === 'asc' ? a[0] - b[0] : b[0] - a[0]))
}

// Accumulate totals at each price point, in order
export function updateTotals(orders: Order[]) {
  orders = orders.reduce<Order[]>((acc, item, i) => {
    const [price, size] = item

    // get the previous total
    const prev = acc[i - 1]
    const nextTotal = prev ? prev[2] + size : size
    return [...acc, [price, size, nextTotal]]
  }, [])

  // append the percentage
  return orders.map<Order>(([price, size, total]) => [
    price,
    size,
    total,
    calcPercentage(total, orders),
  ])
}

// Group by the group size
export function groupOrders(orders: Order[], groupSize: string) {
  if (GROUP_SIZE.XBT[0] === groupSize || GROUP_SIZE.ETH[0] === groupSize) {
    return orders
  }

  // reduce by group size
  orders = orders.reduce<Order[]>((acc, order) => {
    const [price, size, total] = order
    const [prevPrice, prevSize, prevTotal] = acc[acc.length - 1] || []

    // round to nearest group size
    const roundedPrice = roundFloat(price, Number(groupSize))

    // start a new group if the rounded price doesn't match
    if (roundedPrice !== prevPrice) {
      return [...acc, [roundedPrice, size, total]]
    }

    // add new size and total
    const nextSize = prevSize + size
    const nextTotal = prevTotal + size

    return [
      ...acc.slice(0, acc.length - 1),
      [roundedPrice, nextSize, nextTotal],
    ]
  }, [])

  return orders.map<Order>(([price, size, total]) => [
    price,
    size,
    total,
    calcPercentage(total, orders),
  ])
}

/**
 * Private Helpers
 */

function calcPercentage(total: number, orders: Order[]) {
  // use last order total as the grand total
  const lastOrder = orders[orders.length - 1]
  const grandTotal = lastOrder[2]
  return (total / grandTotal) * 100
}

function roundFloat(value: number, toNearest: number) {
  return Math.ceil(value / toNearest) * toNearest
}
