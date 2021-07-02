import { updateOrders, updateTotals, groupOrders } from '../orders'
import { Order } from 'hooks/useWebsocket'

describe('Order Helpers', () => {
  describe('updateOrders()', () => {
    let orders: Order[]
    beforeEach(() => {
      orders = [
        [3000, 200],
        [1234, 123],
        [154, 10],
      ]
    })

    it('should add a new price level if `price` does not exist and has a `size`', () => {
      const updates: Order[] = [[999, 200]]
      const result = updateOrders(orders, updates)
      expect(result).toContainEqual(updates[0])
    })

    it('should remove a `price` level if size is 0', () => {
      const updates: Order[] = [[1234, 0]]
      const result = updateOrders(orders, updates)
      const hasPrice = result.some((order) => order[0] === updates[0][0])
      expect(hasPrice).toBe(false)
    })

    it('should update the `price` level with the new `size`', () => {
      const updates: Order[] = [[1234, 9090]]
      const result = updateOrders(orders, updates)
      const hasPrice = result.some((order) => order[0] === updates[0][0])
      expect(hasPrice).toBe(true)
    })
  })

  describe('updateTotals()', () => {
    let orders: Order[]
    beforeEach(() => {
      orders = [
        [1, 200],
        [2, 200],
        [3, 240],
        [4, 200],
        [5, 200],
      ]
    })

    it('should properly calculate each price levels running total', () => {
      const result = updateTotals(orders)
      let runningTotal = 0
      result.forEach((order) => {
        const [_price, size, total] = order
        runningTotal += size
        expect(total).toEqual(runningTotal)
      })
    })

    it('should calculate the `percentage` of total orders at that `price` level', () => {
      const result = updateTotals(orders)
      const grandTotal = orders.reduce((acc, order) => acc + order[1], 0)

      result.forEach((order) => {
        const [_price, _size, total, percentage] = order
        const calculated = (total / grandTotal) * 100
        expect(percentage).toEqual(calculated)
      })
    })
  })

  describe('groupOrders()', () => {
    let orders: Order[]
    beforeEach(() => {
      orders = [
        [3000.49, 200],
        [3000.5, 30],
        [3000.51, 30],
        [3000.52, 30],
        [3000.53, 30],
        [3000.54, 30],
      ]
    })

    it('should group `price` by the `groupSize`', () => {
      const results = groupOrders(orders, '2.5')
      expect(results).toContainEqual([3002.5, 350, NaN, NaN])
    })
  })
})
