import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, Links, ManagerButton } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ReloadButton } from '@/components/ReloadButton/ReloadButton.component';
import { BACKUP_AGENTS_LIST_QUERY_KEY, useBackupAgentList } from '@/data/hooks/agents/getAgents';
import { useGuideUtils } from '@/hooks/useGuideUtils';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { BACKUP_AGENT_IAM_RULES } from '@/module.constants';
import { urlParams, urls } from '@/routes/routes.constants';

import { useAgentsListingColumnsHooks } from './_hooks/useAgentsListingColumns.hooks';

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
  const guide = useGuideUtils();

  const handleDownloadButton = () => {
    navigate(urls.downloadAgentBackup.replace(urlParams.tenantId, tenantId));
  };

  const handleAddConfiguration = () => {
    navigate(urls.addAgentConfiguration.replace(urlParams.tenantId, tenantId));
  };

  return (
    <section className="flex flex-col gap-8">
      <OdsText>
        <Trans
          ns={BACKUP_AGENT_NAMESPACES.AGENT}
          i18nKey="agents_tab_description"
          components={{
            Link: (
              <Links
                className="px-2"
                rel="noopener noreferrer"
                target="_blank"
                href={guide?.agent}
              />
            ),
          }}
        />
      </OdsText>
      <Suspense>
        {columns && (
          <Datagrid
            topbar={
              <section
                className="flex justify-between"
                role="toolbar"
                aria-label={t('more_action')}
              >
                <div className="flex flex-row gap-4">
                  <ManagerButton
                    id="add-server"
                    size={ODS_BUTTON_SIZE.md}
                    label={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_server`)}
                    onClick={handleAddConfiguration}
                    iamActions={[BACKUP_AGENT_IAM_RULES['vault/edit']]}
                  />
                  <OdsButton
                    variant="outline"
                    size={ODS_BUTTON_SIZE.md}
                    label={t(`${NAMESPACES.ACTIONS}:download`)}
                    onClick={handleDownloadButton}
                  />
                </div>
                <ReloadButton
                  isLoading={isPending}
                  queryKeys={[BACKUP_AGENTS_LIST_QUERY_KEY(tenantId)]}
                />
              </section>
            }
            columns={columns}
            items={flattenData || []}
            totalItems={flattenData?.length || 0}
            isLoading={isPending}
          />
        )}
      </Suspense>
      <Outlet />
    </section>
  );
}
