import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, Links, ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ReloadButton } from '@/components/ReloadButton/ReloadButton.component';
import { agentsQueries } from '@/data/queries/agents.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { useGuideUtils } from '@/hooks/useGuideUtils';
import { BACKUP_AGENT_IAM_RULES } from '@/module.constants';
import { AgentStatusLegend } from '@/pages/services/dashboard/agent/_components/AgentStatusLegend';
import { urls } from '@/routes/routes.constants';

import { useAgentsListingColumnsHooks } from './_hooks/useAgentsListingColumns.hooks';

export default function AgentsListingPage() {
  const { t } = useTranslation([
    BACKUP_AGENT_NAMESPACES.SERVICE_LISTING,
    BACKUP_AGENT_NAMESPACES.AGENT,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { trackClick } = useOvhTracking();
  const columns = useAgentsListingColumnsHooks();
  const { data, isPending } = useQuery(agentsQueries.withClient(queryClient).list());
  const guide = useGuideUtils();

  const handleDownloadButton = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['download-agent'],
    });
    navigate(urls.downloadAgentBackup);
  };

  const handleAddConfiguration = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add-agent-configuration'],
    });
    navigate(urls.addAgentConfiguration);
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
                <div className="flex gap-4">
                  <OdsButton
                    id="details_of_status"
                    variant="ghost"
                    label={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:details_of_status`)}
                  />
                  <OdsPopover triggerId="details_of_status" withArrow>
                    <AgentStatusLegend />
                  </OdsPopover>
                  <ReloadButton isLoading={isPending} queryKeys={[queryKeys.agents.all()]} />
                </div>
              </section>
            }
            columns={columns}
            items={data || []}
            totalItems={data?.length || 0}
            isLoading={isPending}
          />
        )}
      </Suspense>
      <Outlet />
    </section>
  );
}
