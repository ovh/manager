import { Suspense, useCallback, useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, Datagrid } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { useAccessesColumns } from '@/hooks/partitions/useAccessesColumns';
import { usePartitionAccesses } from '@/hooks/partitions/usePartitionAccesses';

export default function AccessesPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['common', 'partition']);
  const { trackClick } = useOvhTracking();

  // Fetch data
  const { data: accesses, isLoading } = usePartitionAccesses(
    serviceName ?? '',
    partitionName ?? '',
  );

  const navigate = useNavigate();
  const columns = useAccessesColumns();

  // Handle create access
  const handleCreateAccess = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'create'],
    });
    void navigate('create');
  }, [trackClick, navigate]);

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
    <>
      <BaseLayout
        header={{
          title: t('partition:accesses.title', 'Access control (ACL)'),
        }}
      >
        <div className="mb-4 text-sm text-gray-600">
          {t('partition:accesses.description', 'Manage IP access to this partition')}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {}
          {/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
          <Datagrid
            columns={columns as any}
            data={(Array.isArray(accesses) ? accesses : []) as any}
            totalCount={Array.isArray(accesses) ? accesses.length : 0}
            isLoading={isLoading}
            topbar={topbarCTA}
          />
          {/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
        </Suspense>
      </BaseLayout>
      {/* Outlet for child routes (create, delete access modals) */}
      <Outlet />
    </>
  );
}
