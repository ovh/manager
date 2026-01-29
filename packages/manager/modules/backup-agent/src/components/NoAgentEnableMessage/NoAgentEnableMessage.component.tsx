import { Trans, useTranslation } from 'react-i18next';

import { useLocation } from 'react-router-dom';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { Links } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useHasAgentEnabled } from '@/data/hooks/agents/useHasAgentEnabled';
import { useGuideUtils } from '@/hooks/useGuideUtils';


export const NoAgentEnableMessage = () => {
  useTranslation(BACKUP_AGENT_NAMESPACES.COMMON);
  const { data, isPending } = useHasAgentEnabled();
  const guidesUrl = useGuideUtils();
  const location = useLocation();

  if (isPending || !data || !location.pathname.startsWith('/services')) return null;

  return (
    <OdsMessage color="information" isDismissible={false} className='w-full'>
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
