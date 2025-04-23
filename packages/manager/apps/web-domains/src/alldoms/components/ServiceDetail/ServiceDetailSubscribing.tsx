import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ServiceDetailSubscribing() {
  const { t } = useTranslation('allDom');
  return (
    <OdsCard color={ODS_CARD_COLOR.neutral} className="w-full p-6">
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('allDom_detail_page_subscribing_title')}
      </OdsText>
    </OdsCard>
  );
}
