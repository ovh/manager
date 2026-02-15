import { Suspense } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Datagrid,
  ManagerButton,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import { subRoutes } from '@/routes/routes.constant';

import { useDatagridColumn } from '@/pages/serviceAccounts/listing/useDatagridColumn';
import { useIamServiceAccountList } from '@/data/hooks/useGetIamServiceAccounts';

import { ServiceAccountsBreadcrumb } from '@/pages/serviceAccounts/components/ServiceAccountsBreadcrumb.component';
import { ServiceAccountsTabs } from '@/pages/serviceAccounts/components/ServiceAccountsTabs.component';

export default function ServiceAccountsListing() {
  const { t } = useTranslation('service-accounts');
  const navigate = useNavigate();

  const header: HeadersProps = {
    title: t('iam_identities'),
  };

  const columns = useDatagridColumn();
  const {
    flattenData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    sorting,
    filters,
    setSorting,
    search,
  } = useIamServiceAccountList({ columns, pageSize: 10 });

  const handleCreateAccount = () => {
    // TODO: tracking
    navigate(subRoutes.serviceAccountsAdd);
  };

  return (
    <BaseLayout
      header={header}
      breadcrumb={<ServiceAccountsBreadcrumb />}
      tabs={<ServiceAccountsTabs />}
    >
      <Datagrid
        topbar={
          <ManagerButton
            id="create-service-account"
            label={t('iam_service_accounts_add_account')}
            onClick={handleCreateAccount}
          />
        }
        isLoading={isLoading}
        columns={columns}
        items={flattenData || []}
        totalItems={10}
        onFetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage && !isLoading}
        sorting={sorting}
        onSortChange={setSorting}
        filters={filters}
        manualSorting={false}
        search={search}
        contentAlignLeft
        getRowId={({ clientId }) => clientId}
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
