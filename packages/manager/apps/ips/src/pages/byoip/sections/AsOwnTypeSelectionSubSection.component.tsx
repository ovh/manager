import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInput, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { getConfigValues } from '../Byoip.utils';
import { ByoipContext } from '../Byoip.context';
import { CONFIG_NAME, useGetCatalog } from '@/data/hooks/catalog/useGetCatalog';

type AsOwnType = string;

export const AsOwnTypeSelectionSubSection: React.FC = () => {
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
    <section className="max-w-[1368px] my-8">
      <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.heading4}>
        {t('ip_byoip_as_rir_title')}
      </OdsText>
      {isLoading ? (
        <div className="text-center">
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {campusValues.map((value) => (
              <OptionCard
                key={value}
                title={value}
                hasRadioButton={true}
                subtitle={t(`rir_selection_${value}_description`)}
                isSelected={asOwnRirType === value}
                onClick={() => setAsOwnRirType(value)}
              />
            ))}
          </div>
          <div className="flex flex-col mt-3">
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
        </>
      )}
    </section>
  );
};
