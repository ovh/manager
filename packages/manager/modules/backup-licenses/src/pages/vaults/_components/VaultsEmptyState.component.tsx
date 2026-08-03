import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

export const VaultsEmptyState = () => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);

  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{t('state.empty.title')}</OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('state.empty.description')}</OdsText>
    </div>
  );
};
