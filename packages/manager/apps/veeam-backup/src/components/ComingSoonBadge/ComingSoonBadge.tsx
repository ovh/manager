import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';

export const ComingSoonBadge: React.FC = () => {
  const { t } = useTranslation('veeam-backup');
  return <OdsBadge className="mt-1" label={t('coming_soon')} />;
};
