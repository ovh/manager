import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { CONFIG_NAME, useGetCatalog } from '@/data/hooks/catalog/useGetCatalog';

import { ByoipContext } from '../Byoip.context';
import { getConfigValues } from '../Byoip.utils';

export const AsOwnTypeSelectionSubSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { asOwnRirType, setAsOwnRirType, asOwnNumberType, setAsOwnNumberType } =
    React.useContext(ByoipContext);
  const { data: catalog, isLoading } = useGetCatalog();
  const campusValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.IPRIR,
  ) as string[];

  return (
    <OrderSection title={t('ip_byoip_as_rir_title')} isLoading={isLoading}>
      <Suspense>
        <div className="grid grid-cols-3 gap-3">
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
          <OdsText preset={ODS_TEXT_PRESET.span}>
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
          />
        </div>
      </Suspense>
    </OrderSection>
  );
};
