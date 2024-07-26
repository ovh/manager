import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { Button } from '@/components/ui/button';
import ServiceStatusBadge from './ServiceStatusBadge.component';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableHeader } from '@/components/ui/data-table';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { humanizeEngine } from '@/lib/engineNameHelper';
import Link from '@/components/links/Link.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';

interface ServiceListColumnsProps {
  onRenameClicked: (service: database.Service) => void;
  onDeleteClicked: (service: database.Service) => void;
}
export const getColumns = ({
  onRenameClicked,
  onDeleteClicked,
}: ServiceListColumnsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('pci-databases-analytics/services');
  const track = useTrackAction();
  const { t: tRegions } = useTranslation('regions');
  const columns: ColumnDef<database.Service>[] = [
    {
      id: 'description/id',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeaderName')}</SortableHeader>
      ),
      accessorFn: (row) => row.description,
      cell: ({ row }) => {
        const { id, description, status, engine, nodes } = row.original;
        return (
          <div className="flex flex-col flex-nowrap text-left">
            {status === database.StatusEnum.DELETING ? (
              <span className="justify-normal px-0 h-auto leading-4 font-semibold py-2">
                {description}
              </span>
            ) : (
              <Button
                asChild
                variant="link"
                className="justify-normal px-0 h-auto leading-4 font-semibold"
              >
                <Link
                  to={id}
                  onClick={() =>
                    track(
                      TRACKING.servicesList.serviceLinkClick(
                        engine,
                        nodes[0].region,
                      ),
                    )
                  }
                >
                  {description}
                </Link>
              </Button>
            )}
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
          {t('tableHeaderEngine')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const { engine, version } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <div className="w-[50px] h-[33px]">
              <img src={`./assets/engines/${engine}.png`} alt={engine} />
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
        <SortableHeader column={column}>{t('tableHeaderPlan')}</SortableHeader>
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
          {t('tableHeaderFlavor')}
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
          {t('tableHeaderStorage')}
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const service = row.original;
        return (
          <span>
            {service.storage && service.storage.size.value > 0
              ? `${service.storage.size.value} ${service.storage.size.unit}`
              : '-'}
          </span>
        );
      },
    },
    {
      id: 'Region',
      accessorFn: (row) => row.nodes[0].region,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderLocation')}
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <span>{tRegions(`region_${row.original.nodes[0].region}`)}</span>
      ),
    },
    {
      id: 'Nodes',
      accessorFn: (row) => row.nodes.length,
      header: ({ column }) => (
        <SortableHeader column={column}>{t('tableHeaderNodes')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="grid grid-cols-3 gap-1 justify-center w-fit">
            {service.nodes.map((node) => {
              let color: string;
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
                  key={node.id}
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
          {t('tableHeaderCreationDate')}
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          <FormattedDate date={new Date(row.original.createdAt)} />
        </span>
      ),
    },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <SortableHeader column={column}>
          {t('tableHeaderStatus')}
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
              <Button
                data-testid="services-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="services-action-content"
              align="end"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                variant="primary"
                onClick={() => navigate(`./${row.original.id}`)}
                disabled={row.original.status === database.StatusEnum.DELETING}
              >
                {t('tableActionManage')}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="primary"
                onClick={() => {
                  track(TRACKING.servicesList.copyIdClick(service.engine));
                  navigator.clipboard.writeText(service.id);
                  toast.success('Service id saved in clipboard', {
                    dismissible: true,
                  });
                }}
              >
                {t('tableActionCopy')}
              </DropdownMenuItem>
              {service.capabilities.service?.update && (
                <DropdownMenuItem
                  data-testid="service-action-rename-button"
                  disabled={
                    service.capabilities.service?.update ===
                    database.service.capability.StateEnum.disabled
                  }
                  variant="primary"
                  onClick={() => {
                    onRenameClicked(row.original);
                  }}
                >
                  {t('tableActionEditName')}
                </DropdownMenuItem>
              )}

              {service.capabilities.service?.delete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    data-testid="service-action-delete-button"
                    disabled={
                      service.capabilities.service?.delete ===
                      database.service.capability.StateEnum.disabled
                    }
                    variant="destructive"
                    onClick={() => {
                      onDeleteClicked(row.original);
                    }}
                  >
                    {t('tableActionDelete')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
