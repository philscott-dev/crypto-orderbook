import { tw } from 'helpers/tailwind'
import { FC } from 'react'

export const Table: FC = ({ children }) => (
  <table className={tw('border-collapse', 'flex-1')}>{children}</table>
)
