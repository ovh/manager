import { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { AvailabilityWithType } from '..';

const AvailabilityTable = ({
  availabilities,
}: {
  availabilities: AvailabilityWithType[];
}) => {
  const columns: ColumnDef<AvailabilityWithType>[] = [
    {
      id: 'engine',
      accessorFn: (row) => row.engine,
      header: ({ column }) => (
        <SortableHeader column={column}>Engine</SortableHeader>
      ),
    },
    {
      id: 'version',
      accessorFn: (row) => row.version,
      header: ({ column }) => (
        <SortableHeader column={column}>Version</SortableHeader>
      ),
    },
    {
      id: 'plan',
      accessorFn: (row) => row.plan,
      header: ({ column }) => (
        <SortableHeader column={column}>Plan</SortableHeader>
      ),
    },
    {
      id: 'region',
      accessorFn: (row) => row.region,
      header: ({ column }) => (
        <SortableHeader column={column}>Region</SortableHeader>
      ),
    },
    {
      id: 'flavor',
      accessorFn: (row) => row.flavor,
      header: ({ column }) => (
        <SortableHeader column={column}>Flavor</SortableHeader>
      ),
    },
    {
      id: 'network',
      accessorFn: (row) => row.network,
      header: ({ column }) => (
        <SortableHeader column={column}>Network</SortableHeader>
      ),
    },
    {
      id: 'type',
      accessorFn: (row) => row.serviceType,
      header: ({ column }) => (
        <SortableHeader column={column}>Type</SortableHeader>
      ),
    },
  ];
  return (
    <>
      <p>Loaded {availabilities.length} availabilities</p>
      <DataTable columns={columns} data={availabilities} pageSize={20} />
    </>
  );
};
export default AvailabilityTable;
