import Image from 'next/image'
import { Customer } from './wood-table'
import setWoodTypes from './page'

interface CustomersTableItemProps {
  customer: Customer
  onCheckboxChange: (id: number, checked: boolean) => void
  isSelected: boolean
}

export default function CustomersTableItem({ customer, onCheckboxChange, isSelected }: CustomersTableItemProps) {

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(customer.id, e.target.checked)
  }

  const handleDisable = async (id: any) => {
    const response = await fetch(`/api/woodtypes/${id}`, {
      method: 'DISABLE',
    });

    if (response.ok) {
      setWoodTypes((prev) => prev.filter((wood) => wood.id !== id));
    } else {
      alert("Failed to delete wood type. Please try again.");
    }
  };

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
        <button className="btn bg-red-500 text-white hover:bg-red-600 m-2"
          onClick={() => handleDisable(customer.id)}>
          Disable Wood
        </button>
      </td>
    </tr>
  )
}
