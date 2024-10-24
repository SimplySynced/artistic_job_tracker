import Link from 'next/link';
import { useState } from 'react';
import { Customer } from './jobs-table'
import EditJob from '@/components/edit-job';

interface CustomersTableItemProps {
  customer: Customer
  onCheckboxChange: (id: number, checked: boolean) => void
  isSelected: boolean
}

export default function CustomersTableItem({ customer, onCheckboxChange, isSelected }: CustomersTableItemProps) {

  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.job_location}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{customer.job_description}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        {/* Buttons */}
        <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white m-2"
          aria-controls="feedback-modal"
          onClick={() => { setFeedbackModalOpen(true) }}>Edit Job
        </button>
        <EditJob isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} title="Edit Job">
          {/* Modal content */}
          <div className="px-5 py-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="first_name">Job Location<span className="text-red-500">*</span></label>
                <input id="first_name" className="form-input w-full px-2 py-1" type="text" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="last_name">Job Description <span className="text-red-500">*</span></label>
                <input id="last_name" className="form-input w-full px-2 py-1" type="text" required />
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
        </EditJob>
        <Link href={`/job/${customer.id}`}>
          <button className="btn bg-green-500 hover:bg-green-600 text-white m-2">View Job</button>
        </Link>
        <button className="btn bg-red-500 text-white hover:bg-red-600 m-2">
          Delete Job
        </button>
      </td>
    </tr>
  )
}