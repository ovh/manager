import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';

export const ComingSoonBadge: React.FC = () => {
  const { t } = useTranslation('veeam-backup');
  return (
    <OsdsChip className="mt-4" inline color={ODS_THEME_COLOR_INTENT.primary}>
      {t('coming_soon')}
    </OsdsChip>
  );
};
