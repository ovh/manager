import { Suspense, startTransition } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupAgentList } from '@/data/hooks/agents/getAgents';
import { useBackupTenantsMocks } from '@/data/hooks/tenants/useBackupTenants';
import { urlParams, urls } from '@/routes/Routes.constants';

import { useAgentsListingColumnsHooks } from './_hooks/useAgentsListingColumns.hooks';

export default function AgentsListingPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_LISTING, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const columns = useAgentsListingColumnsHooks();
  const { flattenData, isLoading } = useBackupAgentList(); // TODO: unmock (useVSPCTenants)

  const onNavigateToDashboardClicked = () => {
    startTransition(() =>
      navigate(urls.dashboardTenants.replace(urlParams.tenantId, tenantId ?? '')),
    );
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
                label={t(`${NAMESPACES.ACTIONS}:download`)}
                onClick={onNavigateToDashboardClicked}
              />
            }
            columns={columns}
            items={flattenData || []}
            totalItems={flattenData?.length || 0}
            isLoading={isLoading}
          />
        )}
      </Suspense>
      <Outlet />
    </>
  );
}
