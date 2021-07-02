import { FC } from 'react'
import { tw } from 'helpers/tailwind'

interface TDProps {
  color?: 'red' | 'green'
}

export const TD: FC<TDProps> = ({ children, color }) => {
  return (
    <td
      className={tw(
        'block',
        'text-white-100',
        'w-2/6',
        'py-1',
        'text-right',
        'text-xs',
        !color
          ? 'text-white-100'
          : color === 'green'
          ? 'text-green-200'
          : 'text-red-200',
      )}
    >
      <div className="w-75 m-auto">{children}</div>
    </td>
  )
}
