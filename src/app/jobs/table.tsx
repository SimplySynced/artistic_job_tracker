'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, ArrowUpDown, PencilLine, Trash2, Plus } from 'lucide-react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table'

type ColumnMeta = {
    label: string
}

type Employee = {
    id: number
    first_name: string
    last_name: string
    nick_name: string | null
    location: string
    pay_rate: number
    added_by: string
    updated_by: string
}

export function EmployeeTable({ data, onEdit, onDelete, onAddNew }: any) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnVisibility, setColumnVisibility] = React.useState({})

    const columns: ColumnDef<Employee, any>[] = [
        {
            accessorFn: (row) => `${row.first_name} ${row.last_name}`,
            id: 'fullName',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            meta: {
                label: 'Name'
            } as ColumnMeta
        },
        {
            accessorKey: 'nick_name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Nickname
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            meta: {
                label: 'Nickname'
            } as ColumnMeta
        },
        {
            accessorKey: 'location',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            meta: {
                label: 'Location'
            } as ColumnMeta
        },
        {
            accessorKey: 'pay_rate',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Pay Rate
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            meta: {
                label: 'Pay Rate'
            } as ColumnMeta,
            cell: ({ row }) => {
                const pay_rate = parseFloat(row.getValue('pay_rate'))
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(pay_rate)
                return formatted
            },
        },
        {
            id: 'actions',
            header: "Actions",
            meta: {
                label: 'Actions'
            } as ColumnMeta,
            cell: ({ row }) => {
                const employee = row.original
                return (
                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onEdit(employee)}
                            className="size-8 text-white bg-sky-500 hover:bg-sky-600"
                        >
                            <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDelete(employee.id)}
                            className="size-8 text-white bg-red-500 hover:bg-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
        },
    })

    return (
        <div className="space-y-2 p-1">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search all columns..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="ml-4 bg-neutral-900 text-white">
                                <SlidersHorizontal className="h-4 w-4" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='bg-white'>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="cursor-pointer"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {(column.columnDef.meta as ColumnMeta)?.label || column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={onAddNew} className="ml-4 bg-neutral-900 text-white">
                        <Plus className="h-4 w-4" />
                        Add Employee
                    </Button>
                </div>
            </div>

            <div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="bg-neutral-900 text-white text-center font-semibold"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-neutral-100 bg-white"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="font-medium text-center">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
