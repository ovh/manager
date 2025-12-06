import { Suspense, startTransition } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupTenantsMocks } from '@/data/hooks/tenants/useBackupTenants';
import { urls } from '@/routes/Routes.constants';

import { useTenantListingColumns } from './_hooks/useVspcTenantListingColumns';

export default function ListingPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_LISTING]);
  const navigate = useNavigate();
  const columns = useTenantListingColumns();
  const { data, isLoading } = useBackupTenantsMocks(); // TODO: unmock (useVSPCTenants)

  const onNavigateToDashboardClicked = () => {
    startTransition(() => navigate(urls.dashboardTenants));
  };

  return (
    <>
      <Suspense>
        {columns && (
          <Datagrid
            topbar={
              <OdsButton
                size={ODS_BUTTON_SIZE.md}
                label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_LISTING}:order`)}
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
    </>
  );
}
