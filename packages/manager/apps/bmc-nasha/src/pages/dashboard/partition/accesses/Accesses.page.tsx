import { Suspense, useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BaseLayout, Datagrid, type DatagridColumn } from '@ovh-ux/muk';
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


  // Handle create access
  const handleCreateAccess = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'create'],
    });
    // TODO: Implement create access form/modal
  }, [trackClick]);

  // Define columns
  const columns = useMemo<DatagridColumn<PartitionAccess>[]>(
    () => [
      {
        id: 'ip',
        label: 'IP',
        cell: ({ ip }) => ip,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'type',
        label: t('partition:accesses.columns.type'),
        cell: ({ type }) => type,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'aclDescription',
        label: t('partition:accesses.columns.description'),
        cell: ({ aclDescription }) => aclDescription || '-',
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'actions',
        label: '',
        cell: (access: PartitionAccess) => <AccessActionsCell ip={access.ip} />,
        isSortable: false,
        enableHiding: false,
      },
    ],
    [t],
  );

  // Topbar CTA button
  const topbarCTA = useMemo(
    () => (
      <button
        type="button"
        onClick={handleCreateAccess}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        {t('partition:accesses.create', 'Create access')}
      </button>
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

