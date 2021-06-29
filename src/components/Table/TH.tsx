import { FC } from 'react'

export const TH: FC = ({ children }) => {
  return (
    <th className="block text-sm py-4 px-0 uppercase text-gray-200 w-2/6">
      <div className="m-auto text-right w-75">{children}</div>
    </th>
  )
}
