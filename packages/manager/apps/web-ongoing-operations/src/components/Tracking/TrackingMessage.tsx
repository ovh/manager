import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TrackingMessage() {
  const { t } = useTranslation('dashboard');
  return (
    <OdsMessage isDismissible={false} className="w-full">
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.heading6} className="block">
          {t('domain_operations_progress_instructions')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.span} className="block">
          {t('domain_operations_progress_instructions_7')}
        </OdsText>
      </div>
    </OdsMessage>
  );
}
