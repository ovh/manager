import { useParams } from 'react-router-dom';
import { BaseLayout, Button, Datagrid, DatagridColumn, ICON_NAME } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { NASHA_BASE_API_URL } from '@/constants/Nasha.constants';

type SnapshotType = {
  type: string;
  enabled: boolean;
};

type Snapshot = {
  type: string;
  name?: string;
  options?: string;
};

export default function SnapshotsPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation('dashboard');

  const { data: snapshots, isLoading } = useQuery({
    queryKey: ['nasha-snapshots', serviceName, partitionName],
    queryFn: async () => {
      const { data } = await v6.get<{ customs?: string[]; snapshotTypes?: SnapshotType[] }>(
        `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/snapshot`,
      );
      return data;
    },
    enabled: !!serviceName && !!partitionName,
    staleTime: 2 * 60 * 1000,
  });

  const columns: DatagridColumn<Snapshot>[] = [
    {
      id: 'type',
      accessorKey: 'type',
      header: t('nasha_dashboard_partition_snapshots_list_type', { defaultValue: 'Type' }),
      enableHiding: false,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: t('nasha_dashboard_partition_snapshots_list_name', { defaultValue: 'Name' }),
      enableHiding: false,
    },
    {
      id: 'options',
      accessorKey: 'options',
      header: t('nasha_dashboard_partition_snapshots_list_options', { defaultValue: 'Options' }),
      enableHiding: false,
    },
  ];

  // Transform data for display
  const snapshotRows: Snapshot[] = [
    ...(snapshots?.customs || []).map((name) => ({ type: 'custom', name, options: '' })),
  ];

  return (
    <div className="nasha-dashboard-partition-snapshots">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {t('nasha_dashboard_partition_snapshots_heading', {
            defaultValue: 'Snapshot Policies',
          })}
        </h2>
        <p className="text-gray-600 mb-4">
          {t('nasha_dashboard_partition_snapshots_description', {
            defaultValue: 'Manage snapshot policies for this partition',
          })}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-medium mb-2">
          {t('nasha_dashboard_partition_snapshots_subtitle', {
            defaultValue: 'Snapshots',
          })}
        </h4>
        <p className="mb-4">
          <strong>
            {t('nasha_dashboard_partition_snapshots_count_title', {
              defaultValue: 'Total snapshots:',
            })}
          </strong>
          <span className="ml-2">{snapshots?.customs?.length || 0}</span>
        </p>
      </div>

      <Button
        variant="default"
        iconLeft={ICON_NAME.plus}
        className="mb-4"
        onClick={() => {
          // TODO: Show create snapshot form
        }}
      >
        {t('nasha_dashboard_partition_snapshots_create', {
          defaultValue: 'Create snapshot',
        })}
      </Button>

      <Datagrid
        columns={columns}
        data={snapshotRows}
        totalCount={snapshotRows.length}
        isLoading={isLoading}
      />
    </div>
  );
}
