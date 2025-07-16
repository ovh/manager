import {
  ODS_CARD_COLOR,
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlldomService } from '@/alldoms/types';

interface ServiceDetailInformationProps {
  readonly currentState: AlldomService['currentState'];
}

export default function ServiceDetailInformation({
  currentState,
}: ServiceDetailInformationProps) {
  const { t } = useTranslation('allDom');
  return (
    <OdsCard
      color={ODS_CARD_COLOR.neutral}
      className="w-full p-6"
      data-testid="ServiceDetailInformation"
    >
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('allDom_detail_page_information_title')}
      </OdsText>

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <div className="flex flex-col gap-y-3">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('allDom_page_detail_information_general_pack', {
            t0: currentState.name,
          })}
        </OdsText>
        <div>
          <OdsText>
            <strong>
              {t('allDom_page_detail_information_general_extensions')}
            </strong>
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.span}>
            {currentState.extensions
              .map((extension) => `.${extension.toLowerCase()}`)
              .join('; ')}
          </OdsText>
        </div>
      </div>
    </OdsCard>
  );
}
