import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Clipboard } from '@ovh-ux/manager-react-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { ByoipContext } from '../Byoip.context';
import { useGetTokens } from '@/data/hooks/useGetTokens';

export const TokenSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { selectedRegion } = React.useContext(ByoipContext);

  const { token, isLoading } = useGetTokens({
    campus: selectedRegion,
  });

  if (isLoading) {
    return (
      <div>
        <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
      </div>
    );
  }

  return (
    <OrderSection
      title={t('region_token_title')}
      description={t('region_token_description')}
    >
      <div>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('region_token_description_1')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('region_token_description_2')}
        </OdsText>
        <OdsText className="pb-1" preset={ODS_TEXT_PRESET.paragraph}>
          {t('region_token_description_3')}
        </OdsText>
        <Clipboard className="w-full" value={token} />
      </div>
    </OrderSection>
  );
};
