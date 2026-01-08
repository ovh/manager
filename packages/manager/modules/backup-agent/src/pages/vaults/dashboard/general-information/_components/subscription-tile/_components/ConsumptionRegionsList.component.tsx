import { useTranslation } from 'react-i18next';

import { OdsBadge } from '@ovhcloud/ods-components/react';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';

type ConsumptionRegionsListProps = {
  primaryRegion: string;
  secondaryRegion?: string;
};

export const ConsumptionRegionsList = ({
  primaryRegion,
  secondaryRegion,
}: ConsumptionRegionsListProps) => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON]);

  return (
    <ul className="flex gap-2 list-none p-0">
      <li>
        <OdsBadge color="information" label={`${t('primary')} : ${primaryRegion}`} />
      </li>
      {secondaryRegion && (
        <li>
          <OdsBadge color="information" label={`${t('secondary')} : ${secondaryRegion}`} />
        </li>
      )}
    </ul>
  );
};
