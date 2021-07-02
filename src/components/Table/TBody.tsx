import { tw } from 'helpers/tailwind'
import { FC } from 'react'

interface TBodyProps {
  shouldReverse?: boolean
}

export const TBody: FC<TBodyProps> = ({ children, shouldReverse }) => (
  <tbody
    className={tw(
      'flex',
      shouldReverse ? 'flex-col-reverse' : 'flex-col',
      'md:flex-col',
    )}
  >
    {children}
  </tbody>
)
