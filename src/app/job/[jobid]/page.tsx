'use client'

import { SelectedItemsProvider } from '@/app/selected-items-context'
import JobTable from './job-table'
import { useEffect, useState } from 'react';

export function JobInfoContent({ jobid }: any) {

  const [jobInfo, setJobInfo] = useState([]);
  const jid = jobid.jobid

  useEffect(() => {
    fetch(`/api/job_info/${jid}`)
      .then((res) => res.json())
      .then((data) => setJobInfo(data));
  }, []);


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"><strong>Jobs Details: </strong></h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          {/* Add customer button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
            <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="max-xs:sr-only">Add Time</span>
          </button>

        </div>

      </div>

      {/* Table */}
      <JobTable jobs={jobInfo} />

      {/* Pagination */}

    </div>
  )
}

export default async function JobInfo({ params }: any) {
  return (
    <SelectedItemsProvider>
      <JobInfoContent jobid={params} />
    </SelectedItemsProvider>
  )
}