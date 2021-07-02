import { NextPage } from 'next'
import { ChangeEvent, useState, useEffect } from 'react'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { subEvent, useWebsocket } from 'hooks/useWebsocket'
import { GROUP_SIZE } from 'contants/groupSize'
import { TD, TH, Table, TBody } from 'components/Table'
import { TR, TRGreen, TRRed } from 'components/Table/TR'
import { Select } from 'components/Select'
import { Button } from 'components/Button'
import { TickIcon } from 'components/TickIcon'
import { H1 } from 'components/H1'
import {
  OrderBook,
  OrderBookBody,
  OrderBookFooter,
  OrderBookHeader,
} from 'components/OrderBook'

const IndexPage: NextPage = () => {
  const [groupSize, setGroupSize] = useState<string>('0.5')
  const [groups, setGroups] = useState(GROUP_SIZE.XBT)
  const { ws, productId, status, asks, bids } = useWebsocket(groupSize)

  // when productId changes, change the groups
  useEffect(() => {
    if (productId === 'PI_XBTUSD') {
      setGroups(GROUP_SIZE.XBT)
      setGroupSize(GROUP_SIZE.XBT[0])
    } else {
      setGroups(GROUP_SIZE.ETH)
      setGroupSize(GROUP_SIZE.ETH[0])
    }
  }, [productId])

  const handleToggleFeed = () => {
    try {
      ws.current.send(subEvent('unsubscribe', productId))
    } catch (e) {
      console.log(e)
    }
  }

  const handleKillFeed = () => {
    try {
      if (status === 'closed' || status === 'error') {
        ws.current.send(subEvent('subscribe', productId))
      } else {
        ws.current.dispatchEvent(new Event('error'))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleChangeGroup = (e: ChangeEvent<HTMLSelectElement>) => {
    setGroupSize(e.target.value)
  }

  return (
    <OrderBook>
      <OrderBookHeader>
        <H1>Order Book</H1>
        <Select
          groupSize={groupSize}
          groups={groups}
          onChange={handleChangeGroup}
        />
      </OrderBookHeader>
      <OrderBookBody>
        <Table>
          <thead>
            <TR shouldReverse shouldHide>
              <TH>PRICE</TH>
              <TH>SIZE</TH>
              <TH>TOTAL</TH>
            </TR>
          </thead>
          <TBody>
            {asks.grouped.map((order, i) => {
              const [price, size, total, percentage] = order
              return (
                <TRRed key={price} percentage={percentage}>
                  <TD color="red">
                    {price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TD>
                  <TD>{size}</TD>
                  <TD>{total}</TD>
                </TRRed>
              )
            })}
          </TBody>
        </Table>
        <Table>
          <thead>
            <TR>
              <TH>PRICE</TH>
              <TH>SIZE</TH>
              <TH>TOTAL</TH>
            </TR>
          </thead>
          <TBody shouldReverse>
            {bids.grouped.map((order, i) => {
              const [price, size, total, percentage] = order
              return (
                <TRGreen key={price} percentage={percentage}>
                  <TD color="green">
                    {price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TD>
                  <TD>{size}</TD>
                  <TD>{total}</TD>
                </TRGreen>
              )
            })}
          </TBody>
        </Table>
      </OrderBookBody>
      <OrderBookFooter>
        <Button color="purple" onMouseDown={handleToggleFeed}>
          <RiArrowLeftRightLine className="mr-1.5" /> Toggle Feed
        </Button>
        <Button color="red" onMouseDown={handleKillFeed}>
          <AiOutlineExclamationCircle className="mr-1.5" />
          Kill Feed
        </Button>
      </OrderBookFooter>
      <TickIcon />
    </OrderBook>
  )
}

export default IndexPage
