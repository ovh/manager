import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupAgentList } from '@/data/hooks/agents/getAgents';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { urlParams, urls } from '@/routes/routes.constants';

import { useAgentsListingColumnsHooks } from './_hooks/useAgentsListingColumns.hooks';
import {ResourceStatus} from "@/types/Resource.type";

export default function AgentsListingPage() {
  const { tenantId } = useRequiredParams('tenantId');
  const { t } = useTranslation([
    BACKUP_AGENT_NAMESPACES.SERVICE_LISTING,
    BACKUP_AGENT_NAMESPACES.AGENT,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();
  const columns = useAgentsListingColumnsHooks();
  const { flattenData, isPending } = useBackupAgentList({ tenantId });

  const handleDownloadButton = () => {
    navigate(urls.downloadAgentBackup.replace(urlParams.tenantId, tenantId));
  };

  const handleAddConfiguration = () => {
    navigate(urls.addAgentConfiguration.replace(urlParams.tenantId, tenantId));
  };

  return (
    <>
      <Suspense>
        {columns && (
          <Datagrid
            topbar={
              <div className="flex flex-row gap-4">
                <OdsButton
                  size={ODS_BUTTON_SIZE.md}
                  label={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_configuration`)}
                  onClick={handleAddConfiguration}
                />
                <OdsButton
                  variant="outline"
                  size={ODS_BUTTON_SIZE.md}
                  label={t(`${NAMESPACES.ACTIONS}:download`)}
                  onClick={handleDownloadButton}
                />
              </div>
            }
            columns={columns}
            items={flattenData || []}
            totalItems={flattenData?.length || 0}
            isLoading={isPending}
          />
        )}
      </Suspense>
      <Outlet />
    </>
  );
}
