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
import { LuPlus, LuSlidersHorizontal, LuArrowUpDown, LuPencilLine, LuTrash2, LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight, LuLoader2, LuPaperclip } from "react-icons/lu";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getPaginationRowModel
} from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ColumnMeta = {
    label: string
}

type Job = {
    id?: number;
    job_code: number;
    job_number: number;
    job_location: string;
    job_customer: string;
    job_address: string;
}

interface JobTableProps {
    data: Job[];
    onEdit: (job: Job) => void;
    onDelete: (jobId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

export function JobTable({ data, onEdit, onDelete, onAddNew, isLoading = false }: JobTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnVisibility, setColumnVisibility] = React.useState({})

    const columns: ColumnDef<Job, any>[] = [
        {
            accessorFn: (row) => `${row.job_code}`,
            id: 'job_code',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Job Code
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Job Code'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.job_number}`,
            id: 'job_number',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Job Number
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Job Number'
            } as ColumnMeta
        },
        {
            accessorKey: 'job_location',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Location
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Location'
            } as ColumnMeta
        },
        {
            accessorKey: 'job_customer',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Customer
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Customer'
            } as ColumnMeta
        },
        {
            accessorKey: 'job_address',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Address
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Address'
            } as ColumnMeta
        },
        {
            id: 'actions',
            header: "Actions",
            meta: {
                label: 'Actions'
            } as ColumnMeta,
            cell: ({ row }) => {
                const job = row.original
                return (
                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onEdit(job)}
                            className="size-8 text-white bg-green-500 hover:bg-green-600"
                        >
                            <LuPaperclip className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onEdit(job)}
                            className="size-8 text-white bg-sky-500 hover:bg-sky-600"
                        >
                            <LuPencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDelete(job.id ?? 0)}
                            className="size-8 text-white bg-red-500 hover:bg-red-600"
                        >
                            <LuTrash2 className="h-4 w-4" />
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
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full sm:max-w-xs"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' className="ml-2 bg-neutral-900 text-white hover:bg-neutral-700">
                                <LuSlidersHorizontal className="mr-1" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                            {table
                                .getAllColumns()
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
                </div>
                <Button onClick={onAddNew} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                    <LuPlus className="mr-1" />
                    Add Job
                </Button>
            </div>

            {/* Responsive table container */}
            <div className="overflow-x-auto">
                <Table className="min-w-full border">
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <LuLoader2 className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-neutral-50 bg-white"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="font-medium text-center"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-neutral-500"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Responsive pagination */}
            <div className="flex flex-col-reverse gap-4 items-center sm:flex-row sm:justify-between sm:space-y-0">
                <div className="text-sm text-neutral-700">
                    {table.getFilteredRowModel().rows.length} total rows
                </div>
                <div className='flex flex-wrap-reverse items-center justify-center gap-4'>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select onValueChange={(value) => table.setPageSize(Number(value))} defaultValue={table.getState().pagination.pageSize.toString()}>
                            <SelectTrigger className="h-8 w-20 rounded-md border border-neutral-200 bg-white">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()} className='cursor-pointer'>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="h-8 w-8 p-0 outline bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                            <LuChevronFirst className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0 outline bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <LuChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium px-2">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <Button variant="outline" className="h-8 w-8 p-0 outline bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <LuChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0 outline bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                            <LuChevronLast className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}
