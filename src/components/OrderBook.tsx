import { FC } from 'react'
import { tw } from 'helpers/tailwind'

export const OrderBook: FC = ({ children }) => (
  <div className={tw('flex', 'flex-col', 'bg-black-600', 'h-screen')}>
    {children}
  </div>
)

export const OrderBookHeader: FC = ({ children }) => (
  <div
    className={tw(
      'flex',
      'justify-between',
      'items-center',
      'py-3.5',
      'px-4',
      'border-solid',
      'border-2',
      'border-gray-300',
    )}
  >
    {children}
  </div>
)

export const OrderBookBody: FC = ({ children }) => (
  <div
    className={tw(
      'relative',
      'flex',
      'flex-col-reverse',
      'm-auto',
      'text-white-100',
      'overflow-auto',
      'h-full',
      'w-full',
      'border-l-2',
      'border-r-2',
      'border-solid',
      'border-gray-300',
      'md:flex-row',
    )}
  >
    {children}
  </div>
)

export const OrderBookFooter: FC = ({ children }) => (
  <div className={tw('flex', 'justify-center', 'p-4', 'bg-gray-300')}>
    {children}
  </div>
)
