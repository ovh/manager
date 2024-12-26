import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { SortingColumn } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface SortableHeaderProps<TData> {
  column: SortingColumn<TData>;
  children: React.ReactNode;
}
export function DatatableSortableHeader<TData>({
  column,
  children,
}: SortableHeaderProps<TData>) {
  const sort = column.getIsSorted();
  let icon = <ChevronsUpDown className="ml-2 h-4 w-4" />;
  if (sort === 'asc') {
    icon = <ChevronUp className="ml-2 h-4 w-4" />;
  } else if (sort === 'desc') {
    icon = <ChevronDown className="ml-2 h-4 w-4" />;
  }

  const buttonClass = `px-0 font-semibold ${
    sort
      ? 'text-primary-500 hover:text-primary-500'
      : 'text-primary-800 hover:text-primary-800'
  }`;
  return (
    <Button
      variant="ghost"
      className={buttonClass}
      onClick={() => column.toggleSorting(sort === 'asc')}
    >
      {children}
      {icon}
    </Button>
  );
}
