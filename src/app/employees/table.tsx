import * as React from 'react';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button'
import { LuPlus, LuSlidersHorizontal, LuArrowUpDown, LuClock, LuPencilLine, LuTrash2, LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight, LuLoader } from "react-icons/lu";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

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
    active: boolean;
};


interface EmployeeTableProps {
    data: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

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
    const [showAll, setShowAll] = React.useState(false);

    const router = useRouter()

    const navigateToTimesheet = (id: number) => {
        router.push(`/timesheet/${id}`)
    }

    // Filter data dynamically based on `showAll`
    const filteredData = React.useMemo(() => {
        return showAll ? data : data.filter((employee) => employee.active);
    }, [data, showAll]);

    console.log(filteredData)

    const columns: ColumnDef<Employee, any>[] = [
        {
            accessorFn: (row) => `${row.first_name} ${row.last_name || ''}`,
            id: 'fullName',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 hover:bg-transparent"
                >
                    Name
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            meta: { label: 'Name' } as ColumnMeta,
        },
        {
            accessorKey: 'nick_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 hover:bg-transparent hidden md:inline-flex"
                >
                    Nickname
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('nick_name') || ''}</span>,
            meta: { label: 'Nickname' } as ColumnMeta,
        },
        {
            accessorKey: 'location',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 hover:bg-transparent hidden md:inline-flex"
                >
                    Location
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('location') || ''}</span>,
            meta: { label: 'Location' } as ColumnMeta,
        },
        {
            accessorKey: 'pay_rate',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 hover:bg-transparent"
                >
                    Pay Rate
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            meta: { label: 'Pay Rate' } as ColumnMeta,
            cell: ({ row }) => {
                const pay_rate = parseFloat(row.getValue('pay_rate'));
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(pay_rate);
            },
        },
        {
            accessorKey: 'active',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 hover:bg-transparent"
                >
                    Status
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            meta: { label: 'Status' } as ColumnMeta,
            cell: ({ row }) => (
                <span className={`font-medium ${row.getValue('active') ? 'text-green-600' : 'text-red-600'}`}>
                    {row.getValue('active') ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
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
        data: filteredData,
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
    });

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
                            <Button variant='outline' className="ml-2 bg-neutral-900 text-white hover:bg-neutral-700">
                                <LuSlidersHorizontal />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='flex gap-4'>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active-only"
                            checked={!showAll}
                            onCheckedChange={() => setShowAll((prev) => !prev)}
                            className='data-[state=checked]:bg-neutral-900 data-[state=unchecked]:bg-neutral-300'
                        />
                        <Label htmlFor="active-only">Active Only</Label>
                    </div>
                    <Button onClick={onAddNew} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                        <LuPlus />
                        Add
                    </Button>
                </div>
            </div>

            {/* Table Rendering */}
            <div className="overflow-x-auto">
                <Table className="min-w-full border">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={`bg-neutral-900 text-white text-center font-semibold ${['nick_name', 'location'].includes(header.column.id) ? 'hidden md:table-cell' : ''}`}
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
                                        <LuLoader className="h-6 w-6 animate-spin" />
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
                                            className={`font-medium text-center ${['nick_name', 'location'].includes(cell.column.id) ? 'hidden md:table-cell' : ''
                                                }`}
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

            {/* Pagination */}
            <div className="flex flex-col-reverse gap-6 items-center lg:flex-row lg:justify-between lg:space-y-0">
                <div className="text-sm text-neutral-700">
                    {table.getFilteredRowModel().rows.length} total rows
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full lg:w-2/3 xl:w-1/2 justify-between lg:justify-end">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select onValueChange={(value) => table.setPageSize(Number(value))} defaultValue={table.getState().pagination.pageSize.toString()}>
                            <SelectTrigger className="h-10 w-20 rounded-md border border-neutral-200 bg-white focus:ring-0 focus:ring-offset-0">
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
                    <div className='flex items-center w-full sm:justify-between md:max-w-sm'>
                        <div className='space-x-1'>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                                <LuChevronFirst />
                            </Button>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                <LuChevronLeft />
                            </Button>
                        </div>
                        <span className="text-sm font-medium px-2 grow sm:grow-0 text-center">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <div className='space-x-1'>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                <LuChevronRight />
                            </Button>
                            <Button variant="outline" className="size-10 p-0 bg-neutral-900 text-white hover:bg-neutral-700" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                                <LuChevronLast />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
