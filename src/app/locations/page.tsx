'use client'

import TimesheetTable from './wood-table'
import { SelectedItemsProvider } from '@/app/selected-items-context'
import { useEffect, useState } from 'react';
import AddWood from '@/components/add-wood';

export function WoodTypes() {

  const [woodTypes, setWoodTypes] = useState<any[]>([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)
  const [newWoodType, setNewWoodType] = useState('');

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch('/api/woods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wood_type: newWoodType }),
    });

    if (response.ok) {
      const addedWoodType = await response.json();
      setWoodTypes((prev) => [...prev, addedWoodType]);
      setFeedbackModalOpen(false);
      setNewWoodType('');
    } else {
      // Show an alert if the request failed
      alert("Failed to add wood type. Please try again.");
    }
  };

  useEffect(() => {
    fetch(`/api/woods/`)
      .then((res) => res.json())
      .then((data) => setWoodTypes(data));
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"><strong>Wood Types</strong></h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          {/* Add customer button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            aria-controls="feedback-modal"
            onClick={() => setFeedbackModalOpen(true)}>
            <span className="max-xs:sr-only">Add Wood</span>
          </button>
          <AddWood isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} title="Add New Wood Type">
            {/* Modal content */}

            <form onSubmit={handleFormSubmit}>
              <div className="px-5 py-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium mb-1" htmlFor="wood_type" >Wood Type <span className="text-red-500">*</span></label>
                  <input
                    className="form-input w-full px-2 py-1"
                    type="text"
                    value={newWoodType}
                    onChange={(e) => setNewWoodType(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Modal footer */}
              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" onClick={() => { setFeedbackModalOpen(false) }}>Cancel</button>
                  <button className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit">Save</button>
                </div>
              </div>
            </form>
          </AddWood>

        </div>

      </div>

      {/* Table */}
      <TimesheetTable customers={woodTypes} />

      {/* Pagination */}

    </div>
  )
}

export default async function Customers({ params }: any) {
  return (
    <SelectedItemsProvider>
      <WoodTypes />
    </SelectedItemsProvider>
  )
}
