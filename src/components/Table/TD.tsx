import { FC } from 'react'

export const TD: FC = ({ children }) => {
  return (
    <td className="block text-white-100 w-2/6 py-1 text-right text-xs">
      <div className="w-75 m-auto">{children}</div>
    </td>
  )
}
