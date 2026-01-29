import { useLocation } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { Links } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { agentsQueries } from '@/data/queries/agents.queries';
import { selectHasAgentEnabled } from '@/data/selectors/agents.selectors';
import { useGuideUtils } from '@/hooks/useGuideUtils';
import { useShowNoAgentEnabledMessage } from '@/hooks/useShowNoAgentEnabledMessage';
import { urls } from '@/routes/routes.constants';

export const NoAgentEnabledMessage = () => {
  useTranslation(BACKUP_AGENT_NAMESPACES.COMMON);
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    ...agentsQueries.withClient(queryClient).list(),
    select: selectHasAgentEnabled,
  });
  const guidesUrl = useGuideUtils();
  const { showBanner, setNoShowBanner } = useShowNoAgentEnabledMessage();
  const location = useLocation();

  const noShowComponent =
    isPending ||
    !showBanner ||
    data ||
    !(
      location.pathname.startsWith(urls.dashboardTenant) ||
      location.pathname.startsWith(urls.dashboardAgents)
    );

  if (noShowComponent) return null;

  return (
    <OdsMessage
      color="information"
      className="w-full block"
      onOdsRemove={() => {
        setNoShowBanner();
      }}
    >
      <Trans
        ns={BACKUP_AGENT_NAMESPACES.COMMON}
        i18nKey="no_agent_enabled_banner"
        components={{
          Link: <Links className="px-2" href={guidesUrl.agent} target="_blank" />,
        }}
      />
    </OdsMessage>
  );
};
