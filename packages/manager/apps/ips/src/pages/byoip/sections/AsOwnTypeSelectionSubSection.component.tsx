import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { INPUT_TYPE, TEXT_PRESET, Input, Text } from '@ovhcloud/ods-react';

import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { CONFIG_NAME, useGetCatalog } from '@/data/hooks/catalog/useGetCatalog';

import { ByoipContext } from '../Byoip.context';
import { getConfigValues } from '../Byoip.utils';

export const AsOwnTypeSelectionSubSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const {
    asOwnRirType,
    setAsOwnRirType,
    asOwnNumberType,
    setAsOwnNumberType,
  } = React.useContext(ByoipContext);
  const { data: catalog, isLoading: loading } = useGetCatalog();
  const campusValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.IPRIR,
  ) as string[];

  return (
    <OrderSection title={t('ip_byoip_as_rir_title')} loading={loading}>
      <Suspense>
        <div className="grid grid-cols-3 gap-4">
          {campusValues.map((value) => (
            <OptionCard
              key={value}
              title={value}
              hasRadioButton
              subtitle={t(`rir_selection_${value}_description`)}
              isSelected={asOwnRirType === value}
              onClick={() => setAsOwnRirType(value)}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-col">
          <Text preset={TEXT_PRESET.span}>{t('ip_byoip_as_number_label')}</Text>
          <Input
            className="mt-1"
            name="asNumber"
            type={INPUT_TYPE.number}
            required
            value={asOwnNumberType}
            onChange={(event) => setAsOwnNumberType(Number(event.target.value))}
          />
        </div>
      </Suspense>
    </OrderSection>
  );
};
