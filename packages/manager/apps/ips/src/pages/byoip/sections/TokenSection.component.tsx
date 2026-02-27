import React from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Clipboard } from '@ovh-ux/muk';

import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { useGetTokens } from '@/data/hooks/useGetTokens';

import { ByoipContext } from '../Byoip.context';

export const TokenSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { selectedRegion } = React.useContext(ByoipContext);

  const { token, isLoading: loading } = useGetTokens({
    campus: selectedRegion,
  });

  return (
    <OrderSection
      title={t('region_token_title')}
      description={t('region_token_description')}
      loading={loading}
    >
      <div>
        <Text preset={TEXT_PRESET.paragraph}>
          {t('region_token_description_1')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
          {t('region_token_description_2')}
        </Text>
        <Text className="pb-1" preset={TEXT_PRESET.paragraph}>
          {t('region_token_description_3')}
        </Text>
        <Clipboard className="w-full" value={token} />
      </div>
    </OrderSection>
  );
};
