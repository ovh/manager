import React from 'react';

import { useTranslation } from 'react-i18next';

import { Input, Text, INPUT_TYPE, TEXT_PRESET } from '@ovhcloud/ods-react';

import { OrderSection } from '@/components/OrderSection/OrderSection.component';

import { ByoipContext } from '../Byoip.context';
import { ipRangePlaceholder, isValidIpRange } from '../Byoip.utils';

export const IpRangeSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { ipRange, setIpRange } = React.useContext(ByoipContext);

  return (
    <OrderSection
      title={t('ip_range_selection_title')}
      description={t('ip_range_selection_description')}
    >
      <div className="flex flex-col">
        <Text preset={TEXT_PRESET.caption}>
          {t('ip_range_selection_input_label')}
        </Text>
        <Input
          className="mt-1 w-7/12"
          name="ipRange"
          type={INPUT_TYPE.text}
          required
          value={ipRange}
          placeholder={ipRangePlaceholder}
          onChange={(event) => setIpRange(event.target.value)}
          invalid={!isValidIpRange(ipRange)}
        />
      </div>
    </OrderSection>
  );
};
