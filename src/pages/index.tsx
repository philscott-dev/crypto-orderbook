import { NextPage } from 'next'
import { ChangeEvent } from 'react'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { IoChevronDownSharp } from 'react-icons/io5'
import { TD, TH } from 'components/Table'
import { subEvent, useWebsocket } from 'hooks/useWebsocket'
import { useState } from 'react'
import { useEffect } from 'react'
import { GROUP_SIZE } from 'contants/groupSize'

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
    <div className="relative bg-black-600">
      <div className="bookHeader">
        <h1 className="text-base text-white-100">Order Book</h1>
        <div className="relative">
          <select
            value={groupSize}
            className="h-24 rounded-sm outline-none border-none py-0 pr-7 pl-3 text-white-100 bg-gray-200 text-sm appearance-none"
            onChange={handleChangeGroup}
          >
            {groups.map((value, i) => (
              <option key={i} value={value}>
                Group {value}
              </option>
            ))}
          </select>
          <IoChevronDownSharp className="absolute right-1.5 top-1 text-white-100" />
        </div>
      </div>
      <div className="bookBody m-auto text-white-100">
        <table className="border-collapse flex-1">
          <thead>
            <tr className="flex flex-row md:flex-row-reverse">
              <TH>PRICE</TH>
              <TH>SIZE</TH>
              <TH>TOTAL</TH>
            </tr>
          </thead>
          <tbody className="flex flex-col md:flex-col">
            {asks.grouped.map((order, i) => {
              const [price, size, total, percentage] = order
              return (
                <tr
                  key={price}
                  className="flex flex-row bg-no-repeat bg-right md:flex-row-reverse"
                  style={{
                    backgroundImage: 'url(red.png)',
                    backgroundSize: `${percentage}% 100%`,
                  }}
                >
                  <TD>
                    {price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TD>
                  <TD>{size}</TD>
                  <TD>{total}</TD>
                </tr>
              )
            })}
          </tbody>
        </table>
        <table className="border-collapse flex-1">
          <thead>
            <tr className="flex">
              <TH>PRICE</TH>
              <TH>SIZE</TH>
              <TH>TOTAL</TH>
            </tr>
          </thead>
          <tbody className="flex flex-col-reverse md:flex-col">
            {bids.grouped.map((order, i) => {
              const [price, size, total, percentage] = order
              return (
                <tr
                  key={price}
                  className="flex bg-no-repeat bg-right md:bg-left"
                  style={{
                    backgroundImage: 'url(green.png)',
                    backgroundSize: `${percentage}% 100%`,
                  }}
                >
                  <TD>
                    {price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TD>
                  <TD>{size}</TD>
                  <TD>{total}</TD>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="bookFooter">
        <button
          className="flex rounded-sm items-center py-2.5 px-4 mx-1.5 text-white-100 bg-purple-300"
          onMouseDown={handleToggleFeed}
        >
          <RiArrowLeftRightLine className="mr-1.5" /> Toggle Feed
        </button>
        <button
          className="flex rounded-sm items-center py-2.5 px-4 mx-1.5 text-white-100 bg-red-300"
          onMouseDown={handleKillFeed}
        >
          <AiOutlineExclamationCircle className="mr-1.5" />
          Kill Feed
        </button>
      </div>
      <i className="absolute right-4 bottom-20 h-6 w-6 border-r-2 border-b-2 border-solid border-gray-200" />
    </div>
  )
}

export default IndexPage
