'use client'

import { SelectedItemsProvider } from '@/app/selected-items-context'
import DeleteButton from '@/components/delete-button'
import { useEffect, useState } from 'react';
import CustomersTable from './jobs-table'

export function EmployeesContent() {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
      fetch('/api/jobs')
        .then((res) => res.json())
        .then((data) => setJobs(data));
    }, []);

    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">

          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Jobs</h1>
          </div>

          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

            {/* Delete button */}
            <DeleteButton />

            {/* Add customer button */}
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
              <span className="max-xs:sr-only">Add Job</span>
            </button>

          </div>

        </div>

        {/* Table */}
        <CustomersTable customers={jobs} />

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