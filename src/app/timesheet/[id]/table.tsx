import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { TimeSheet } from '@/types';
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
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
import {
    LuChevronFirst,
    LuChevronLast,
    LuChevronLeft,
    LuChevronRight,
    LuLoader,
    LuPlus,
    LuSlidersHorizontal,
    LuArrowUpDown,
    LuTrash2,
    LuPencilLine,
} from 'react-icons/lu';

type ColumnMeta = {
    label: string;
};

interface LaborCode {
    job_labor_code: string;
    description: string;
}

interface TimesheetTableProps {
    data: TimeSheet[];
    onEdit: (timesheet: TimeSheet) => void;
    onDelete: (timesheetId: number) => void;
    onAddNew: () => void;
    isLoading: boolean;
}

/**
 * Converts an ISO-formatted time string (e.g., "1970-01-01T19:00:00.000Z")
 * to a 12-hour time string with AM/PM (e.g., "7:00 PM").
 * This version uses toLocaleTimeString with timeZone set to 'UTC'
 * so that the time is not adjusted for the local timezone.
 */
const formatTime12 = (timeStr: string): string => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export function TimeSheetTable({
  data,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}: TimesheetTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [laborCodes, setLaborCodes] = useState<{ [key: number]: LaborCode }>({});

  useEffect(() => {
    // Fetch labor code details for each job_code in data
    const fetchLaborCodes = async () => {
      const jobCodes = [...new Set(data.map((item) => item.job_code))]; // Unique job codes
      const fetchedCodes: { [key: number]: LaborCode } = {};

      await Promise.all(
        jobCodes.map(async (jobCode) => {
          try {
            const response = await fetch(`/api/laborcodes/${jobCode}`);
            if (response.ok) {
              const result = await response.json();
              fetchedCodes[jobCode] = {
                job_labor_code: result.job_labor_code || 'N/A',
                description: result.description || 'No Description',
              };
            }
          } catch (error) {
            console.error(`Error fetching labor code ${jobCode}:`, error);
          }
        })
      );

      setLaborCodes(fetchedCodes);
    };

    if (data.length > 0) {
      fetchLaborCodes();
    }
  }, [data]);

  const columns: ColumnDef<TimeSheet, any>[] = [
    {
      accessorFn: (row) => `${row.date_worked}`,
      id: 'date_worked',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Date Worked
          <LuArrowUpDown className="ml-1" />
        </Button>
      ),
      meta: { label: 'Date Worked' } as ColumnMeta,
    },
    {
      accessorKey: 'job_number',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Job Number
          <LuArrowUpDown className="ml-1" />
        </Button>
      ),
      meta: { label: 'Job Number' } as ColumnMeta,
    },
    {
      accessorFn: (row) => row.job_code,
      id: 'jobCode',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Job Code
          <LuArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ row }) => {
        const jobCode: any = row.getValue('jobCode');
        const laborCode = laborCodes[jobCode];
        return laborCode ? (
          <span>
            {laborCode.job_labor_code} - {laborCode.description}
          </span>
        ) : (
          <span>Loading...</span>
        );
      },
      meta: { label: 'Job Code' } as ColumnMeta,
    },
    {
      accessorKey: 'begin_time',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Begin Time
          <LuArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const timeStr = getValue<string>(); // e.g., "1970-01-01T19:00:00.000Z"
        return formatTime12(timeStr);
      },
      meta: { label: 'Begin Time' } as ColumnMeta,
    },
    {
      accessorKey: 'end_time',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          End Time
          <LuArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const timeStr = getValue<string>();
        return formatTime12(timeStr);
      },
      meta: { label: 'End Time' } as ColumnMeta,
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
      accessorKey: 'added_by',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Added By
          <LuArrowUpDown className="ml-1" />
        </Button>
      ),
      meta: { label: 'Added By' } as ColumnMeta,
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { label: 'Actions' } as ColumnMeta,
      cell: ({ row }) => {
        const timesheet = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(timesheet)}
              className="size-8 text-white bg-sky-500 hover:bg-sky-600"
            >
              <LuPencilLine className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(timesheet.id ?? 0)}
              className="size-8 text-white bg-red-500 hover:bg-red-600"
            >
              <LuTrash2 className="h-4 w-4" />
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
                <Button variant="outline" className="ml-2 bg-neutral-900 text-white hover:bg-neutral-700">
                    <LuSlidersHorizontal className="mr-1" />
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
            <Button onClick={onAddNew} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto">
            <LuPlus className="mr-1" />
            Add Time Entry
            </Button>
        </div>

        {/* Responsive table container */}
        <div className="overflow-x-auto">
            <Table className="min-w-full border">
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="bg-neutral-900 text-white text-center font-semibold">
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
                <SelectContent className="bg-white">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()} className="cursor-pointer">
                        {pageSize}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="flex items-center w-full sm:justify-between md:max-w-sm">
                <div className="space-x-1">
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
                <div className="space-x-1">
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
