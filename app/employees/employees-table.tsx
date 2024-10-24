'use client'

import { StaticImageData } from 'next/image'
import { useItemSelection } from '@/components/utils/use-item-selection'
import CustomersTableItem from './employees-table-item'

export interface Customer {
  id: number
  first_name: string
  last_name: string
  nick_name: string
  location: string
  pay_rate: string
}

export default function CustomersTable({ customers }: { customers: Customer[]}) {
  const {
    selectedItems,
    isAllSelected,
    handleCheckboxChange,
  } = useItemSelection(customers)

  console.log(customers)

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">

      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">First Name</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Last Name</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Nick Name</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Location</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold">Pay Rate</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {customers.map(customer => (
                <CustomersTableItem
                  key={customer.id}
                  customer={customer}
                  onCheckboxChange={handleCheckboxChange}
                  isSelected={selectedItems.includes(customer.id)} />
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}