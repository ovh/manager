import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { database } from '@/models/database';
import { Button } from '@/components/ui/button';
import ServiceStatusBadge from './serviceStatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableHeader } from '@/components/ui/data-table';
import FormattedDate from '@/components/table-date';
import { humanizeEngine } from '@/lib/engineNameHelper';

interface ServiceListColumnsProps {
  onRenameClicked: (service: database.Service) => void;
}
export const getColumns = ({ onRenameClicked }: ServiceListColumnsProps) => {
  const { t } = useTranslation('pci-databases-analytics/services');
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<database.Service>[] = [
    {
      id: 'description/id',
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-name')}
        </SortableHeader>
      ),
      accessorFn: (row) => row.description,
      cell: ({ row }) => {
        const { id, description } = row.original;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            <Button
              asChild
              variant="link"
              className="justify-normal px-0 h-auto leading-4 font-semibold"
            >
              <Link to={id}>{description}</Link>
            </Button>
            <span className="text-sm whitespace-nowrap">{id}</span>
          </div>
        );
      },
    },
    {
      id: 'Engine',
      accessorFn: (row) => row.engine,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-engine')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const { engine, version } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <div className="w-[50px] h-[33px]">
              <img src={`./assets/engines/${engine}.png`} />
            </div>
            <span className="whitespace-nowrap">{humanizeEngine(engine)}</span>
            <span>{version}</span>
          </div>
        );
      },
    },
    {
      id: 'Plan',
      accessorFn: (row) => row.plan,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-plan')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const { plan } = row.original;
        return <span className="capitalize">{plan}</span>;
      },
    },
    {
      id: 'Flavor',
      accessorFn: (row) => row.flavor,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-flavor')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const { flavor } = row.original;
        return <span className="capitalize">{flavor}</span>;
      },
    },
    {
      id: 'Storage',
      accessorFn: (row) => row.storage?.size.value ?? 0,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-storage')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const service = row.original;
        return service.storage && service.storage.size.value > 0
          ? `${service.storage.size.value} ${service.storage.size.unit}`
          : '-';
      },
    },
    {
      id: 'Region',
      accessorFn: (row) => row.nodes[0].region,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-location')}
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <>{tRegions(`region_${row.original.nodes[0].region}`)}</>
      ),
    },
    {
      id: 'Nodes',
      accessorFn: (row) => row.nodes.length,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-nodes')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="grid grid-cols-3 gap-1 justify-center w-fit">
            {service.nodes.map((node, i) => {
              let color = 'bg-gray-500';
              switch (node.status) {
                case database.StatusEnum.UPDATING:
                case database.StatusEnum.PENDING:
                case database.StatusEnum.CREATING:
                case database.StatusEnum.DELETING:
                  color = 'bg-yellow-500';
                  break;
                case database.StatusEnum.LOCKED:
                case database.StatusEnum.LOCKED_PENDING:
                case database.StatusEnum.LOCKED_UPDATING:
                  color = 'bg-orange-500';
                  break;
                case database.StatusEnum.ERROR:
                case database.StatusEnum.ERROR_INCONSISTENT_SPEC:
                  color = 'bg-red-500';
                  break;
                case database.StatusEnum.READY:
                  color = 'bg-green-500';
                  break;
                default:
                  color = 'bg-gray-500';
                  break;
              }
              return (
                <span
                  className={`inline-block w-5 h-5 ${color} rounded-full`}
                  key={i}
                />
              );
            })}
          </div>
        );
      },
    },
    {
      id: 'Creation date',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-creation-date')}
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <FormattedDate date={new Date(row.original.createdAt)} />
      ),
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('table-header-status')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        return <ServiceStatusBadge status={row.original.status} />;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const service = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(service.id);
                  toast.success('Service id saved in clipboard', {
                    dismissible: true,
                  });
                }}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onRenameClicked(row.original);
                }}
              >
                Edit name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
