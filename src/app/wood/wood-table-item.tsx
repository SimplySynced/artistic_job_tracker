import Image from 'next/image'
import { Customer } from './wood-table'

interface CustomersTableItemProps {
  customer: Customer
  onCheckboxChange: (id: number, checked: boolean) => void
  isSelected: boolean
}

export default function CustomersTableItem({ customer, onCheckboxChange, isSelected }: CustomersTableItemProps) {

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(customer.id, e.target.checked)
  }

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.wood_type}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        {/* Menu button */}
        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full">
          <span className="sr-only">Menu</span>
          
        </button>
      </td>
    </tr>
  )
}