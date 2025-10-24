import { Suspense, startTransition } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaseLayout, Breadcrumb, Datagrid, Notifications } from '@ovh-ux/manager-react-components';

import { appName } from '@/App.constants';
import { useVSPCTenantsMocks } from '@/data/hooks/useVspcTenants';
import { urls } from '@/routes/Routes.constants';

import { useVspcListingColumns } from './_hooks/useVspcTenantListingColumns';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);
  const navigate = useNavigate();
  const columns = useVspcListingColumns();
  const { data, isLoading } = useVSPCTenantsMocks(); // TODO: unmock (useVSPCTenants)

  const onNavigateToDashboardClicked = () => {
    startTransition(() => navigate(urls.dashboard));
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb rootLabel={appName} appName={appName} />}
      header={{ title: t('listing:title') }}
      message={<Notifications />}
    >
      <Suspense>
        {columns && (
          <Datagrid
            topbar={
              <OdsButton
                icon={ODS_ICON_NAME.network}
                size={ODS_BUTTON_SIZE.md}
                label={t('listing:order')}
                onClick={onNavigateToDashboardClicked}
              />
            }
            columns={columns}
            items={data || []}
            totalItems={data?.length || 0}
            isLoading={isLoading}
          />
        )}
      </Suspense>
      <Outlet />
    </BaseLayout>
  );
}
