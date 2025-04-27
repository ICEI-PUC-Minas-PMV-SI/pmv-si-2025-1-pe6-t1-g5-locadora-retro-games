import { ReactElement } from "react";

export interface DataTableHeader<T> {
  key: keyof T;
  label: string;
  type?: 'string' | 'number' | 'boolean' | 'date';
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  headers: DataTableHeader<T>[];
  data: T[];
  fetchData: () => void;
  total: number;
  limit: number;
  page: number;
  field: string;
  order: string;
  placeholder: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setField: (field: string) => void;
  setOrder: (order: 'asc' | 'desc' | ((order: 'asc' | 'desc') => 'asc' | 'desc')) => void;
}

declare function DataTable<T = any>(props: DataTableProps<T>): ReactElement;

export default DataTable;