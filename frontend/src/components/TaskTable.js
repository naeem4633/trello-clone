import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Filters from "./Filters";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TaskTable = ({tasks, setTasks, boards}) => {
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      size: 225,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 225,
    },
    {
      accessorKey: "boardId",
      header: "Board ID",
      size: 100,
    },
  ];
  const [columnFilters, setColumnFilters] = useState([
    { id: "title", value: "" },
    { id: "description", value: "" },
    { id: "boardId", value: "" },
  ]);

    const table = useReactTable({
      data: tasks, 
      columns,
      state: {
        columnFilters,
      },
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      meta: {
        updateData: (rowIndex, columnId, value) =>
          setTasks((prev) =>
            prev.map((row, index) =>
              index === rowIndex
                ? {
                    ...prev[rowIndex],
                    [columnId]: value,
                  }
                : row
            )
          ),
      },
    });

    return (
      <div className="overflow-x-auto p-4 bg-gray-100 rounded-lg shadow-md">
        <Filters tasks={tasks} columnFilters={columnFilters} setColumnFilters={setColumnFilters} boards={boards} />
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" key={header.id}>
                    <div className="flex items-center justify-between">
                      <span>{header.column.columnDef.header}</span>
                      {header.column.getCanSort() && (
                        <button
                          className="p-1"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <SwapVertIcon fontSize="inherit" />
                        </button>
                      )}
                      <span>
                        {
                          {
                            asc: <ArrowUpwardIcon fontSize="small" />,
                            desc: <ArrowDownwardIcon fontSize="small" />,
                          }[header.column.getIsSorted()] || null
                        }
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default TaskTable;