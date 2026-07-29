import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

export default function OnboardingDescription() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ONBOARDING);

  return (
    <section className="flex flex-col items-center gap-2 text-center">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <b>{t('subtitle')}</b>
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('description')}</OdsText>
    </section>
  );
}
