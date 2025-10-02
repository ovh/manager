import { Suspense, startTransition } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaseLayout, Datagrid } from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useBackupTenantsMocks } from '@/data/hooks/useBackupTenants';
import { useListingColumns } from '@/pages/listing/_hooks/useTenantListingColumns';
import { urls } from '@/routes/Routes.constants';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);
  const navigate = useNavigate();
  const columns = useListingColumns();
  const { data, isLoading } = useBackupTenantsMocks(); // TODO: unmock (useTenant || useListingData)

  const onNavigateToDashboardClicked = () => {
    startTransition(() => navigate(urls.dashboard));
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{ title: t('listing:title') }}
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
    </BaseLayout>
  );
}
