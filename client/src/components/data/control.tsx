import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
const Control = ({ table }) => {
  const [selectedFilter, setSelectedFilter] = useState("name");
  const [selectedFilterRegister, setSelectedFilterRegister] = useState("lastComment");

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
    if (hasId) {
      setSelectedFilterRegister(selectedValue);
    }
    console.log(`Selected filter option: ${selectedValue}`);
    // You can perform further actions here based on the selected option
  };

  const location = useLocation();

      // Check if "id" exists in the pathname
      const hasId = location.pathname.includes(
        "/dashboard/formtable/students/register/"
      );
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center">
      <div className="flex items-center py-4 space-x-4">
        {!hasId ? 
        <>
        
          <label className="flex px-3 items-center">
            <input
            
              type="radio"
              name="filterOption"
              value="name"
              checked={selectedFilter === "name"}
              onChange={handleFilterChange}
              className="opacity-40 w-3  "
              /* defaultChecked */
            />
            <span className="text-slate-600 px-3 font-light">Name</span>
          </label>
          <label className="flex px-3 items-center">
            <input
              type="radio"
              name="filterOption"
              value="types"
              checked={selectedFilter === "types"}
              onChange={handleFilterChange}
              className="opacity-40 w-3"
            />
            <span className="text-slate-600 px-3 font-light">Types</span>
          </label>
          <label className="flex text-slate-600 px-3 items-center">
            <input
              type="radio"
              name="filterOption"
              value="email"
              checked={selectedFilter === "email"}
              onChange={handleFilterChange}
              className="opacity-40 w-3"
            />
            <span className="font-light text-slate-600 px-3">Email</span>
          </label>
        </>
         : <>
          
         </>}
        </div>
        
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder={`Search ${!hasId ? selectedFilter :"" }`}
          value={
            (table.getColumn(!hasId ? selectedFilter :selectedFilterRegister)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(!hasId ? selectedFilter :selectedFilterRegister)?.setFilterValue(event.target.value)
          }
          className="w-36 bg-slate-300"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="m-2 w-30 p-4 bg-slate-300">
            Add or Remove
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="pagination-controls py-4  ">
        <Input
          className="mx-2 w-20 py-4 bg-slate-300"
          type="number"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        />
        <h4
        
        style={{
          color:"#2e2727",
          paddingInline:14

        }}>

        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </h4>
      </div>

      <Button onClick={() => table.setPageIndex(0)} className="py-4 m-2">
        First
      </Button>
      <Button
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        className="py-4 m-2"
      >
        Last
      </Button>
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        className="py-4 m-2"
      >
        Previous
      </Button>
      <Button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        className="py-4 m-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Control;
