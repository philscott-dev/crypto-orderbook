import { tw } from 'helpers/tailwind'
import { FC } from 'react'

export const H1: FC = ({ children }) => (
  <h1 className={tw('text-base', 'text-white-100')}>{children}</h1>
)
