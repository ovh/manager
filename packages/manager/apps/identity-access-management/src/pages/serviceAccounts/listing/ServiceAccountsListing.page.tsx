import { Suspense, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Datagrid,
  HeadersProps,
  ManagerButton,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { subRoutes } from '@/routes/routes.constant';

import { useDatagridColumn } from '@/pages/serviceAccounts/listing/useDatagridColumn';
import { useIamServiceAccountList } from '@/data/hooks/useGetIamServiceAccounts';
import { ServiceAccountSecretProvider } from '@/contexts/service-account-secret.context';

import { ServiceAccountsBreadcrumb } from '@/pages/serviceAccounts/components/ServiceAccountsBreadcrumb.component';
import { ServiceAccountsTabs } from '@/pages/serviceAccounts/components/ServiceAccountsTabs.component';
import { IamServiceAccountFlow } from '@/data/api/iam-service-accounts';
import { SERVICE_ACCOUNTS_TRACKING, } from '@/tracking.constant';

export default function ServiceAccountsListing() {
  const { t } = useTranslation('service-accounts');
  const { trackClick } = useOvhTracking();
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
  const filteredList = useMemo(() => {
    return flattenData?.filter(
      (d) => d.flow === IamServiceAccountFlow.CLIENT_CREDENTIALS,
    );
  }, [flattenData]);

  const handleCreateAccount = () => {
    trackClick({
      actionType: 'action',
      actions: SERVICE_ACCOUNTS_TRACKING.LISTING.ADD_ACCOUNT,
    });
    navigate(subRoutes.serviceAccountsAdd);
  };

  return (
    <BaseLayout
      header={header}
      breadcrumb={<ServiceAccountsBreadcrumb />}
      tabs={<ServiceAccountsTabs />}
      message={<Notifications />}
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
        items={filteredList || []}
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
      <ServiceAccountSecretProvider>
        <Suspense>
          <Outlet />
        </Suspense>
      </ServiceAccountSecretProvider>
    </BaseLayout>
  );
}
