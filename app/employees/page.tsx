'use client'

import { SelectedItemsProvider } from '@/app/selected-items-context'
import CustomersTable from './employees-table'
import { useEffect, useState } from 'react';
import AddEmployee from '@/components/add-employee';

export function EmployeesContent() {

    const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)
    const [employees, setEmployees] = useState([]);

    // Fetch employee list on page load
    useEffect(() => {
      fetch('/api/employees')
        .then((res) => res.json())
        .then((data) => setEmployees(data));
    }, []);

    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">

          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Choose Employee:</h1>
          </div>

          {/* Right: Actions */}
          <div className="grid sm:auto-cols-max justify-start sm:justify-end">

            {/* Add customer button */}

            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              aria-controls="feedback-modal"
              onClick={() => { setFeedbackModalOpen(true) }}>Add Employee
            </button>
            <AddEmployee isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} title="Add Employee">
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
            </AddEmployee>

          </div>

        </div>

        {/* Table */}
        <CustomersTable customers={employees} />

        {/* Pagination */}

      </div>
    )
  }

  export default function Customers() {
    return (
      <SelectedItemsProvider>
        <EmployeesContent />
      </SelectedItemsProvider>
    )
  }