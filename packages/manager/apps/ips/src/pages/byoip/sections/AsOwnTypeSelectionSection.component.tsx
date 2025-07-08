import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInput, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { getConfigValues } from '../Byoip.utils';
import { ByoipContext } from '../Byoip.context';
import { CONFIG_NAME, useGetCatalog } from '@/data/hooks/catalog/useGetCatalog';

type AsOwnType = string;

export const AsOwnTypeSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const {
    asOwnRirType,
    setAsOwnRirType,
    asOwnNumberType,
    setAsOwnNumberType,
  } = React.useContext(ByoipContext);
  const { data: catalog, isLoading } = useGetCatalog();
  const campusValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.IPRIR,
  ) as AsOwnType[];

  if (isLoading) {
    return (
      <div>
        <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
      </div>
    );
  }
  return (
    <OrderSection title={t('ip_byoip_as_rir_title')}>
      <div className="grid grid-rows-2 gap-3">
        {campusValues.map((value) => (
          <OptionCard
            key={value}
            title={value}
            isSelected={asOwnRirType === value}
            onClick={() => setAsOwnRirType(value)}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('ip_byoip_as_number_label')}
        </OdsText>
        <OdsInput
          className="mt-1"
          name="asNumber"
          type={ODS_INPUT_TYPE.number}
          isRequired
          value={asOwnNumberType}
          onOdsChange={(event) =>
            setAsOwnNumberType(event.detail.value as number)
          }
        ></OdsInput>
      </div>
    </OrderSection>
  );
};
