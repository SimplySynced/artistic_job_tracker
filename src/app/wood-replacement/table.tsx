import React, { useEffect, useState } from 'react';
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
import { LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight, LuLoader, LuPlus, LuSlidersHorizontal, LuArrowUpDown, LuTrash2, LuPencilLine } from 'react-icons/lu'

type ColumnMeta = {
    label: string
}

type WoodReplacement = {
    replace_cost_id: number;
    wood_id: number;
    wood_type: string;
    thickness: number;
    waste_factor: number;
    unit: string;
    replacement?: number;
    price?: number;
    updated_date: string;
};

interface WoodReplacementTableProps {
    data: WoodReplacement[];
    onEdit: (woodreplacement: WoodReplacement) => void;
    onDelete: (replaceCostId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

export function WoodReplacementTable({ data, onEdit, onDelete, onAddNew, isLoading = false }: WoodReplacementTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnVisibility, setColumnVisibility] = React.useState({})

    const columns: ColumnDef<WoodReplacement, any>[] = [
        {
            accessorFn: (row) => `${row.replace_cost_id}`,
            id: 'replaceCostId',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Replace Cost ID
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Replace Cost ID'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.wood_id}`,
            id: 'woodId',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Wood ID
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Wood ID'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.wood_type}`,
            id: 'woodType',
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
            meta: {
                label: 'Wood Type'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.thickness}/4`,
            id: 'thickness',
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
            accessorFn: (row) => `${row.waste_factor}`,
            id: 'wasteFactor',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Waste Factor
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Waste Factor'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.unit}`,
            id: 'unit',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Unit
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Unit'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.replacement}`,
            id: 'replacement',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Replacement
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Replacement'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.price}`,
            id: 'price',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Price
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Price'
            } as ColumnMeta
        },
        {
            accessorFn: (row) => `${row.updated_date}`,
            id: 'updatedDate',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Updated Date
                        <LuArrowUpDown className="ml-1" />
                    </Button>
                )
            },
            meta: {
                label: 'Updated Date'
            } as ColumnMeta
        },
        {
            id: 'actions',
            header: "Actions",
            meta: {
                label: 'Actions'
            } as ColumnMeta,
            cell: ({ row }) => {
                const woodreplacement = row.original
                return (
                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onEdit(woodreplacement)}
                            className="size-8 text-white bg-sky-500 hover:bg-sky-600"
                        >
                            <LuPencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDelete(woodreplacement.replace_cost_id ?? 0)}
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
                <Button onClick={onAddNew} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
                    <LuPlus className="mr-1" />
                    Add Wood Replacement
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
