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
} from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight, LuLoader, LuPlus, LuSlidersHorizontal, LuPrinter, LuArrowUpDown, LuTrash2, LuPencilLine } from 'react-icons/lu'

type ColumnMeta = {
    label: string
}

// The main data structure used for time sheet entries
type LumberCost = {
    id?: number;
    date: string;
    job_number: number;
    wood_id: number;
    wood_type: string;
    wood_replace_id: number;
    quantity: number;
    description: string;
    thickness: number;
    length: number;
    width: number;
    cost_over: number;
    total_cost: number;
    ft_per_piece: number;
    price: number;
    tbf: number;
    entered_by: string;
    entered_date: string;
    updated_by: string;
    updated_date: string
};

interface JobTableProps {
    data: LumberCost[];
    jn : number;
    onEdit: (lumbersheet: LumberCost) => void;
    onDelete: (lumbersheetId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

export function JobTable({ data, jn, onEdit, onDelete, onAddNew, isLoading = false }: JobTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnVisibility, setColumnVisibility] = React.useState({})

    console.log(jn)

    const generateLumberCostReport = async () => {
        try {
            const response = await fetch('/api/generate-lumber-cost-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data, jn }),
            });

            if (response.ok) {
                const { filename, pdf } = await response.json();
                // Create a Blob and trigger download
                const pdfBlob = new Blob([Uint8Array.from(atob(pdf), (c) => c.charCodeAt(0))], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(pdfBlob);
                link.download = filename;
                link.click();
            } else {
                console.error('Failed to generate PDF');
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    const generateTimeSheetReport = async () => {
        try {
            const response = await fetch('/api/generate-timesheet-job-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data, jn }),
            });

            if (response.ok) {
                const { filename, pdf } = await response.json();
                // Create a Blob and trigger download
                const pdfBlob = new Blob([Uint8Array.from(atob(pdf), (c) => c.charCodeAt(0))], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(pdfBlob);
                link.download = filename;
                link.click();
            } else {
                console.error('Failed to generate PDF');
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    const columns: ColumnDef<LumberCost, any>[] = [
        {
            accessorFn: (row) => `${row.date}`,
            id: 'date',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Date
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Date'
            } as ColumnMeta
        },
        {
            accessorKey: 'quantity',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Quantity
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Quantity'
            } as ColumnMeta
        },
        {
            accessorKey: 'wood_type',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Wood Type
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('wood_type') || ''}</span>,
            meta: { label: 'Wood Type' } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.thickness * 4}/4`,
            accessorKey: 'thickness',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Thickness
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Thickness'
            } as ColumnMeta
        },
        {
            accessorKey: 'width',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Width
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Width'
            } as ColumnMeta
        },
        {
            accessorKey: 'length',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Length
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Length'
            } as ColumnMeta
        },
        {
            accessorKey: 'description',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Description
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            cell: ({ row }) => <span className="hidden md:inline">{row.getValue('description') || ''}</span>,
            meta: { label: 'Description' } as ColumnMeta
        },
        {
            accessorKey: 'tbf',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Total Board Feet
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const tbf = row.getValue('tbf');
                return tbf ? Number(tbf).toFixed(2) : '0.00';
            },
            meta: {
                label: 'Total Board Feet'
            } as ColumnMeta
        },
        {
            accessorKey: 'ft_per_piece',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        FT/P
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'FT/P'
            } as ColumnMeta
        },
        {
            accessorKey: 'price',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 hover:bg-transparent"
                >
                    Price
                    <LuArrowUpDown className="ml-1" />
                </Button>
            ),
            cell: ({ row }) => (
                <span>
                    {row.getValue('price') !== undefined
                        ? `$${Number(row.getValue('price')).toFixed(2)}`
                        : ''}
                </span>
            ),
            meta: { label: 'Price' } as ColumnMeta,
        },
        {
            id: 'actions',
            header: "Actions",
            meta: {
                label: 'Actions'
            } as ColumnMeta,
            cell: ({ row }) => {
                const lumbercost = row.original
                return (
                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onEdit(lumbercost)}
                            className="size-8 text-white bg-sky-500 hover:bg-sky-600"
                        >
                            <LuPencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDelete(lumbercost.id ?? 0)}
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
                                <LuSlidersHorizontal className="mr-1" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='bg-white'>
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
                <Button onClick={generateTimeSheetReport} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                    <LuPrinter className="mr-1" />
                    Print Time Sheet Report
                </Button>
                <Button onClick={generateLumberCostReport} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                    <LuPrinter className="mr-1" />
                    Print Lumber Cost
                </Button>
                <Button onClick={onAddNew} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                    <LuPlus className="mr-1" />
                    Add Lumber Cost
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
                            <TableRow className="hover:bg-neutral-50 bg-white text-black">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <LuLoader className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-neutral-50 bg-white text-black">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="font-medium text-center">
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

            {/* Responsive pagination */}
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
    )
}
