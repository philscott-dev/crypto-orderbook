import { FC } from 'react'
import { tw } from 'helpers/tailwind'

export const TR: FC<{ shouldReverse?: boolean; shouldHide?: boolean }> = ({
  children,
  shouldReverse,
  shouldHide,
}) => (
  <tr
    className={tw(
      'flex',
      'flex-row',
      'md:opacity-100',
      shouldReverse ? 'md:flex-row-reverse' : null,
      shouldHide ? 'opacity-0' : null,
    )}
  >
    {children}
  </tr>
)

interface TRProps {
  percentage?: number
}

export const TRRed: FC<TRProps> = ({ percentage, children }) => (
  <tr
    className={tw(
      'flex',
      'flex-row',
      'bg-no-repeat',
      'bg-right',
      'md:flex-row-reverse',
    )}
    style={{
      backgroundImage: 'url(red.png)',
      backgroundSize: `${percentage}% 100%`,
    }}
  >
    {children}
  </tr>
)

export const TRGreen: FC<TRProps> = ({ percentage, children }) => (
  <tr
    className={tw('flex', 'bg-no-repeat', 'bg-right', 'md:bg-left')}
    style={{
      backgroundImage: 'url(green.png)',
      backgroundSize: `${percentage}% 100%`,
    }}
  >
    {children}
  </tr>
)
