import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsInput } from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { ByoipContext } from '../Byoip.context';
import { isValidIpRange, ipRangePlaceholder } from '../Byoip.utils';

export const IpRangeSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { ipRange, setIpRange } = React.useContext(ByoipContext);

  return (
    <OrderSection
      title={t('ip_range_selection_title')}
      description={t('ip_range_selection_description')}
    >
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('ip_range_selection_input_label')}
        </OdsText>
        <OdsInput
          className="mt-1 w-7/12"
          name="ipRange"
          type={ODS_INPUT_TYPE.text}
          isRequired
          value={ipRange}
          placeholder={ipRangePlaceholder}
          onOdsChange={(event) => setIpRange(event.detail.value as string)}
          hasError={!isValidIpRange(ipRange)}
        ></OdsInput>
      </div>
    </OrderSection>
  );
};
