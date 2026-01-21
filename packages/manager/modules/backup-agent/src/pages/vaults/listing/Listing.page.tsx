import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { useBackupVaultsList } from '@/data/hooks/vaults/getVault';

import { useColumns } from './_hooks/useColumns.hooks';

export default function ListingPage() {
  const { data } = useBackupVaultsList();
  const columns = useColumns();

  return (
    <Suspense>
      <Datagrid columns={columns} items={data ?? []} totalItems={data?.length ?? 0} />
      <Outlet />
    </Suspense>
  );
}
