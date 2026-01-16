import { useTranslation } from 'react-i18next';

import { GuideItem } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useGuideUtils } from '@/hooks/useGuideUtils';

export const useMainGuideItem = (): GuideItem[] => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON]);
  const guides = useGuideUtils();

  return [
    {
      id: 0,
      label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:backup_agent_guide`),
      href: guides.main ?? '',
      target: '_blank',
    },
  ];
};
