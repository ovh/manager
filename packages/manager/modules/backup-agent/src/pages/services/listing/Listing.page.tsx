import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { useBackupTenants } from '@/data/hooks/tenants/useBackupTenants';

import { useTenantListingColumns } from './_hooks/useVspcTenantListingColumns';

export default function ListingPage() {
  const columns = useTenantListingColumns();
  const { data, isLoading } = useBackupTenants();

  return (
    <>
      <Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={data || []}
            totalItems={data?.length || 0}
            isLoading={isLoading}
          />
        )}
      </Suspense>
      <Outlet />
    </>
  );
}
