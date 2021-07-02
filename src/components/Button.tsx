import { FC, MouseEvent } from 'react'
import { tw } from 'helpers/tailwind'

interface ButtonProps {
  color: 'red' | 'purple'
  onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void
}

export const Button: FC<ButtonProps> = ({ color, onMouseDown, children }) => (
  <button
    className={tw(
      'flex',
      'rounded-sm',
      'items-center',
      'py-2.5',
      'px-4',
      'mx-1.5',
      'text-white-100',
      color === 'red' ? 'bg-red-300' : 'bg-purple-300',
    )}
    onMouseDown={onMouseDown}
  >
    {children}
  </button>
)
