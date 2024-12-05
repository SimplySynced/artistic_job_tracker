<<<<<<< HEAD
import * as React from 'react';
import { Input } from '@/components/ui/input';
=======
import * as React from 'react'
import { Input } from '@/components/ui/input'
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
<<<<<<< HEAD
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    LuPlus,
    LuSlidersHorizontal,
    LuArrowUpDown,
    LuClock,
    LuPencilLine,
    LuTrash2,
    LuChevronFirst,
    LuChevronLast,
    LuChevronLeft,
    LuChevronRight,
    LuLoader2,
} from 'react-icons/lu';
=======
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LuPlus, LuSlidersHorizontal, LuArrowUpDown, LuClock, LuPencilLine, LuTrash2, LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight, LuLoader2 } from "react-icons/lu";
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
<<<<<<< HEAD
    getPaginationRowModel,
} from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
=======
    getPaginationRowModel
} from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))

type ColumnMeta = {
    label: string;
};

export type Employee = {
    id?: number;
    first_name: string;
    last_name: string | null; // Allow null for nullable fields
    nick_name: string | null;
    location: string | null;
    pay_rate: number;
    added_by: string | null;
    updated_by: string | null;
};


interface EmployeeTableProps {
    data: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

<<<<<<< HEAD
export function EmployeeTable({
    data,
    onEdit,
    onDelete,
    onAddNew,
    isLoading = false,
}: EmployeeTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnVisibility, setColumnVisibility] = React.useState({});
=======
export type Employee = {
    id?: number;
    first_name: string;
    last_name: string;
    nick_name: string;
    location: string;
    pay_rate: number;
    added_by: string;
    updated_by: string;
};

interface EmployeeTableProps {
    data: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

export function EmployeeTable({ data, onEdit, onDelete, onAddNew, isLoading = false }: EmployeeTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnVisibility, setColumnVisibility] = React.useState({})
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))

    const router = useRouter()

    const navigateToTimesheet = (id: number) => {
        router.push(`/timesheet/${id}`)
    }

    const columns: ColumnDef<Employee, any>[] = [
        {
            accessorFn: (row) => `${row.first_name} ${row.last_name || ''}`,
            id: 'fullName',
            header: ({ column }) => (
                <Button
                    variant="ghost"
<<<<<<< HEAD
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
=======
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                    className="p-0 hover:bg-transparent"
                >
                    Name
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
<<<<<<< HEAD
            meta: { label: 'Name' } as ColumnMeta,
=======
            meta: { label: 'Name' } as ColumnMeta
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
        },
        {
            accessorKey: 'nick_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
<<<<<<< HEAD
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
=======
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                    className="p-0 hover:bg-transparent hidden md:inline-flex"
                >
                    Nickname
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
<<<<<<< HEAD
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('nick_name') || ''}</span>,
            meta: { label: 'Nickname' } as ColumnMeta,
=======
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('nick_name')}</span>,
            meta: { label: 'Nickname' } as ColumnMeta
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
        },
        {
            accessorKey: 'location',
            header: ({ column }) => (
                <Button
                    variant="ghost"
<<<<<<< HEAD
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
=======
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                    className="p-0 hover:bg-transparent hidden md:inline-flex"
                >
                    Location
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
<<<<<<< HEAD
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('location') || ''}</span>,
            meta: { label: 'Location' } as ColumnMeta,
=======
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('location')}</span>,
            meta: { label: 'Location' } as ColumnMeta
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
        },
        {
            accessorKey: 'pay_rate',
            header: ({ column }) => (
                <Button
                    variant="ghost"
<<<<<<< HEAD
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
=======
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                    className="p-0 hover:bg-transparent"
                >
                    Pay Rate
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            meta: { label: 'Pay Rate' } as ColumnMeta,
            cell: ({ row }) => {
<<<<<<< HEAD
                const pay_rate = parseFloat(row.getValue('pay_rate'));
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(pay_rate);
=======
                const pay_rate = parseFloat(row.getValue('pay_rate'))
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(pay_rate)
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
            },
        },
        {
            id: 'actions',
<<<<<<< HEAD
            header: 'Actions',
=======
            header: "Actions",
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
            meta: { label: 'Actions' } as ColumnMeta,
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigateToTimesheet(employee.id ?? 0)}
                            className="size-8 text-white bg-green-500 hover:bg-green-600"
                            aria-label="View Timesheet"
                        >
                            <LuClock />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onEdit(employee)}
                            className="size-8 text-white bg-sky-500 hover:bg-sky-600"
                            aria-label="Edit Employee"
                        >
                            <LuPencilLine />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDelete(employee.id ?? 0)}
                            className="size-8 text-white bg-red-500 hover:bg-red-600"
                            aria-label="Delete Employee"
                        >
                            <LuTrash2 />
                        </Button>
                    </div>
                );
            },
        },
    ];

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
<<<<<<< HEAD
    });
=======
    })
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))

    return (
        <div className="space-y-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto grow">
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full sm:max-w-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                            <Button variant="outline" className="ml-2 bg-neutral-900 text-white hover:bg-neutral-700">
=======
                            <Button variant='outline' className="ml-2 bg-neutral-900 text-white hover:bg-neutral-700">
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                                <LuSlidersHorizontal className="mr-1" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
<<<<<<< HEAD
                            {table.getAllColumns().map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="cursor-pointer"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {(column.columnDef.meta as ColumnMeta)?.label || column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
=======
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
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button onClick={onAddNew} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                    <LuPlus className="mr-1" />
                    Add Employee
                </Button>
            </div>

<<<<<<< HEAD
            {/* Table Rendering */}
=======
            {/* Responsive table container */}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
            <div className="overflow-x-auto">
                <Table className="min-w-full border">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
<<<<<<< HEAD
                                        className={`bg-neutral-900 text-white text-center font-semibold ${['nick_name', 'location'].includes(header.column.id) ? 'hidden md:table-cell' : ''
                                            }`}
=======
                                        className={`bg-neutral-900 text-white text-center font-semibold ${['nick_name', 'location'].includes(header.column.id) ? 'hidden md:table-cell' : ''}`}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="hover:bg-neutral-50 bg-white">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <LuLoader2 className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-neutral-50 bg-white">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
<<<<<<< HEAD
                                            className={`font-medium text-center ${['nick_name', 'location'].includes(cell.column.id) ? 'hidden md:table-cell' : ''
                                                }`}
=======
                                            className={`font-medium text-center ${['nick_name', 'location'].includes(cell.column.id) ? 'hidden md:table-cell' : ''}`}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-neutral-500">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

<<<<<<< HEAD
            {/* Pagination */}
=======
            {/* Responsive pagination */}
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
            <div className="flex flex-col-reverse gap-6 items-center lg:flex-row lg:justify-between lg:space-y-0">
                <div className="text-sm text-neutral-700">
                    {table.getFilteredRowModel().rows.length} total rows
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full lg:w-2/3 xl:w-1/2 justify-between lg:justify-end">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
<<<<<<< HEAD
                        <Select
                            onValueChange={(value) => table.setPageSize(Number(value))}
                            defaultValue={table.getState().pagination.pageSize.toString()}
                        >
                            <SelectTrigger className="h-10 w-20 rounded-md border border-neutral-200 bg-white focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()} className="cursor-pointer">
=======
                        <Select onValueChange={(value) => table.setPageSize(Number(value))} defaultValue={table.getState().pagination.pageSize.toString()}>
                            <SelectTrigger className="h-10 w-20 rounded-md border border-neutral-200 bg-white focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()} className='cursor-pointer'>
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
<<<<<<< HEAD
                    <div className="flex items-center w-full sm:justify-between md:max-w-sm">
                        <div className="space-x-1">
                            <Button
                                variant="outline"
                                className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <LuChevronFirst />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
=======
                    <div className='flex items-center w-full sm:justify-between md:max-w-sm'>
                        <div className='space-x-1'>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                                <LuChevronFirst />
                            </Button>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                                <LuChevronLeft />
                            </Button>
                        </div>
                        <span className="text-sm font-medium px-2 grow sm:grow-0 text-center">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
<<<<<<< HEAD
                        <div className="space-x-1">
                            <Button
                                variant="outline"
                                className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <LuChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
=======
                        <div className='space-x-1'>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                <LuChevronRight />
                            </Button>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
                                <LuChevronLast />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
