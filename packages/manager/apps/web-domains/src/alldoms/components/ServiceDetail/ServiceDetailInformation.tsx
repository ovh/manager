import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CARD_COLOR,
  Divider,
  DIVIDER_COLOR,
  DIVIDER_SPACING,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { AlldomService } from '@/alldoms/types';

interface ServiceDetailInformationProps {
  readonly currentState: AlldomService['currentState'];
}

export default function ServiceDetailInformation({
  currentState,
}: ServiceDetailInformationProps) {
  const { t } = useTranslation('allDom');
  return (
    <Card
      color={CARD_COLOR.neutral}
      className="w-full p-6"
      data-testid="ServiceDetailInformation"
    >
      <Text preset={TEXT_PRESET.heading4}>
        {t('allDom_detail_page_information_title')}
      </Text>

      <Divider color={DIVIDER_COLOR.primary} spacing={DIVIDER_SPACING._24} />

      <div className="flex flex-col gap-y-3">
        <Text preset={TEXT_PRESET.heading6}>
          {t('allDom_page_detail_information_general_pack', {
            packName: currentState.name,
          })}
        </Text>
        <div>
          <Text>
            <strong>
              {t('allDom_page_detail_information_general_extensions')}
            </strong>
          </Text>
          <Text preset={TEXT_PRESET.span}>
            {currentState.extensions
              .map((extension) => `.${extension.toLowerCase()}`)
              .join('; ')}
          </Text>
        </div>
      </div>
    </Card>
  );
}
