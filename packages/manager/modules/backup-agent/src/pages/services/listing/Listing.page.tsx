import { Suspense, startTransition } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { useVSPCTenantsMocks } from '@/data/hooks/tenants/useVspcTenants';
import { urls } from '@/routes/Routes.constants';

import { useVspcListingColumns } from './_hooks/useVspcTenantListingColumns';
import {BACKUP_AGENT_NAMESPACES} from "@/BackupAgent.translations";

export default function ListingPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_LISTING]);
  const navigate = useNavigate();
  const columns = useVspcListingColumns();
  const { data, isLoading } = useVSPCTenantsMocks(); // TODO: unmock (useVSPCTenants)

  const onNavigateToDashboardClicked = () => {
    startTransition(() => navigate(urls.dashboard));
  };

  return (
    <>
      <Suspense>
        {columns && (
          <Datagrid
            topbar={
              <OdsButton
                icon={ODS_ICON_NAME.network}
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
