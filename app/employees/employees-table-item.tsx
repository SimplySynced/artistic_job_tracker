import Link from 'next/link';
import { useState } from 'react';
import { Customer } from './employees-table'
import EditEmployee from '@/components/edit-employee';

interface CustomersTableItemProps {
  customer: Customer
  onCheckboxChange: (id: number, checked: boolean) => void
  isSelected: boolean
}

export default function CustomersTableItem({ customer, onCheckboxChange, isSelected }: CustomersTableItemProps) {

  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(customer.id, e.target.checked)
  }

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="font-medium text-gray-800 dark:text-gray-100">{customer.first_name}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.last_name}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.nick_name}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.location}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center">${customer.pay_rate}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <Link href={`/timesheets/${customer.id}`}>
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white mx-5">
            <span className="max-xs:sr-only">Timesheet</span>
          </button>
        </Link>
        {/* Edit button */}
        <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
          aria-controls="feedback-modal"
          onClick={() => { setFeedbackModalOpen(true) }}>Edit Employee
        </button>
        <EditEmployee isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} title="Edit Employee">
          {/* Modal content */}
          <div className="px-5 py-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="first_name">First Name <span className="text-red-500">*</span></label>
                <input id="first_name" className="form-input w-full px-2 py-1" type="text" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="last_name">Last Name <span className="text-red-500">*</span></label>
                <input id="last_name" className="form-input w-full px-2 py-1" type="text" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="nick_name">Nick Name <span className="text-red-500">*</span></label>
                <input id="last_name" className="form-input w-full px-2 py-1" type="text" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="nick_name">Location <span className="text-red-500">*</span></label>
                <input id="location" className="form-input w-full px-2 py-1" type="text" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="pay_rate">Pay Rate <span className="text-red-500">*</span></label>
                <input id="pay_rate" className="form-input w-full px-2 py-1" type="text" required />
              </div>
            </div>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
            <div className="flex flex-wrap justify-end space-x-2">
              <button className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" onClick={() => { setFeedbackModalOpen(false) }}>Cancel</button>
              <button className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Save</button>
            </div>
          </div>
        </EditEmployee>
      </td>
    </tr>
  )
}