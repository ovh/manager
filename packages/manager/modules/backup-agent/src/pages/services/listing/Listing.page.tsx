import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { Datagrid, useNotifications } from '@ovh-ux/manager-react-components';

import { useVSPCTenants } from '@/data/hooks/tenants/useVspcTenants';
import { useAgentConfigurationGuide } from '@/pages/_hooks/useAgentConfigurationGuide';

import { useTenantListingColumns } from './_hooks/useVspcTenantListingColumns';

export default function ListingPage() {
  const columns = useTenantListingColumns();
  const { data, isPending } = useVSPCTenants();
  useAgentConfigurationGuide();

  return (
    <>
      <Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={data || []}
            totalItems={data?.length || 0}
            isLoading={isPending}
          />
        )}
      </Suspense>
      <Outlet />
    </>
  );
}
