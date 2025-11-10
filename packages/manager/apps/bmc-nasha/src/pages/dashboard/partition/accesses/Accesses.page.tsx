import { Suspense, useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import { BaseLayout, Datagrid, type DatagridColumn, Button } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { usePartitionAccesses } from '@/hooks/partitions/usePartitionAccesses';
import { APP_NAME } from '@/Tracking.constants';

import AccessActionsCell from '@/components/partition/accesses/AccessActionsCell.component';

type PartitionAccess = {
  ip: string;
  type: string;
  aclDescription?: string;
};

export default function AccessesPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation(['common', 'partition']);
  const { trackClick } = useOvhTracking();

  // Fetch data
  const { data: accesses, isLoading } = usePartitionAccesses(serviceName ?? '', partitionName ?? '');


  const navigate = useNavigate();

  // Handle create access
  const handleCreateAccess = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'create'],
    });
    navigate('create');
  }, [trackClick, navigate]);

  // Define columns using accessorKey and header as required by MUK Datagrid
  const columns = useMemo<DatagridColumn<PartitionAccess>[]>(
    () => [
      {
        accessorKey: 'ip',
        header: 'IP',
        cell: ({ row }) => row.original.ip,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'type',
        header: t('partition:accesses.columns.type'),
        cell: ({ row }) => row.original.type,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'aclDescription',
        header: t('partition:accesses.columns.description'),
        cell: ({ row }) => row.original.aclDescription || '-',
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => <AccessActionsCell ip={row.original.ip} />,
        isSortable: false,
        enableHiding: false,
      },
    ],
    [t],
  );

  // Topbar CTA button
  const topbarCTA = useMemo(
    () => (
      <Button variant="default" onClick={handleCreateAccess}>
        {t('partition:accesses.create', 'Create access')}
      </Button>
    ),
    [t, handleCreateAccess],
  );

  return (
    <BaseLayout
      header={{
        title: t('partition:accesses.title', 'Access control (ACL)'),
        description: t('partition:accesses.description', 'Manage IP access to this partition'),
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Datagrid
          columns={columns}
          data={Array.isArray(accesses) ? accesses : []}
          totalCount={Array.isArray(accesses) ? accesses.length : 0}
          isLoading={isLoading}
          topbar={topbarCTA}
          enableSearch
          enableFilter
          enableColumnVisibility
        />
      </Suspense>
    </BaseLayout>
  );
}

