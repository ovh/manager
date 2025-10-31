import { useParams } from 'react-router-dom';
import { BaseLayout, Button, Datagrid, DatagridColumn, ActionMenu, ICON_NAME } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { NASHA_BASE_API_URL } from '@/constants/Nasha.constants';

type Access = {
  ip: string;
  type: string;
  typeLabel?: string;
  aclDescription?: string;
};

export default function AccessesPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation('dashboard');

  const { data: accesses, isLoading } = useQuery({
    queryKey: ['nasha-accesses', serviceName, partitionName],
    queryFn: async () => {
      const { data } = await v6.get<Access[]>(
        `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/access`,
      );
      return data.map((access) => ({
        ...access,
        typeLabel: access.type || access.type,
      }));
    },
    enabled: !!serviceName && !!partitionName,
    staleTime: 2 * 60 * 1000,
  });

  const handleDeleteClick = (ip: string) => {
    // TODO: Implement delete access
    console.log('Delete access:', ip);
  };

  const columns: DatagridColumn<Access>[] = [
    {
      id: 'ip',
      accessorKey: 'ip',
      header: 'IP',
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: t('nasha_dashboard_partition_accesses_list_type', { defaultValue: 'Type' }),
      cell: ({ row }) => row.original.typeLabel || row.original.type,
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'aclDescription',
      accessorKey: 'aclDescription',
      header: t('nasha_dashboard_partition_accesses_list_description', {
        defaultValue: 'Description',
      }),
      cell: ({ row }) => row.original.aclDescription || '-',
      enableHiding: false,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ActionMenu
          id={`delete-access-${row.original.ip}`}
          isCompact
          popoverPosition="end"
          items={[
            {
              id: 1,
              label: t('nasha_dashboard_partition_accesses_delete', { defaultValue: 'Delete' }),
              onClick: () => handleDeleteClick(row.original.ip),
            },
          ]}
        />
      ),
      enableHiding: false,
    },
  ];

  return (
    <div className="nasha-dashboard-partition-accesses">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {t('nasha_dashboard_partition_accesses_heading', {
            defaultValue: 'Access Control (ACL)',
          })}
        </h2>
        <p className="text-gray-600 mb-4">
          {t('nasha_dashboard_partition_accesses_description', {
            defaultValue: 'Manage access control for this partition',
          })}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-medium mb-4">
          {t('nasha_dashboard_partition_accesses_subtitle', {
            defaultValue: 'Accesses',
          })}
        </h4>
      </div>

      <Datagrid
        columns={columns}
        data={accesses || []}
        totalCount={accesses?.length || 0}
        isLoading={isLoading}
        topbar={
          <div className="flex justify-end mb-4">
            <Button
              variant="default"
              iconLeft={ICON_NAME.plus}
              onClick={() => {
                // TODO: Show create access form
              }}
            >
              {t('nasha_dashboard_partition_accesses_create', {
                defaultValue: 'Create access',
              })}
            </Button>
          </div>
        }
      />
    </div>
  );
}
