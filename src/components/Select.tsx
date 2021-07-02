import { ChangeEvent, FC } from 'react'
import { IoChevronDownSharp } from 'react-icons/io5'
import { tw } from 'helpers/tailwind'

interface SelectProps {
  groupSize: string
  groups: string[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export const Select: FC<SelectProps> = ({ groupSize, groups, onChange }) => {
  return (
    <div className={tw('relative', 'mr-6')}>
      <select
        value={groupSize}
        className={tw(
          'h-24',
          'rounded-sm',
          'outline-none',
          'border-none',
          'py-0',
          'pr-7',
          'pl-3',
          'text-white-100',
          'bg-gray-200',
          'text-sm',
          'appearance-none',
        )}
        onChange={onChange}
      >
        {groups.map((value, i) => (
          <option key={i} value={value}>
            Group {value}
          </option>
        ))}
      </select>
      <IoChevronDownSharp
        className={tw('absolute', 'right-1.5', 'top-1', 'text-white-100')}
      />
    </div>
  )
}
