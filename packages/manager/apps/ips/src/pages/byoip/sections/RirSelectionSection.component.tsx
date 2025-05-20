import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { useGetCatalog, CONFIG_NAME } from '@/data/hooks/catalog/useGetCatalog';
import { ByoipContext } from '../Byoip.context';
import { getConfigValues } from '../Byoip.utils';

export const RirSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { data: catalog, isLoading } = useGetCatalog();
  const { ipRir, setIpRir } = React.useContext(ByoipContext);

  const ipRirValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.IPRIR,
  ) as string[];

  if (isLoading) {
    return (
      <div>
        <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
      </div>
    );
  }

  return (
    <OrderSection
      title={t('rir_selection_title')}
      description={t('rir_selection_description')}
    >
      <div className="grid grid-rows-2 gap-3">
        {ipRirValues.map((value) => (
          <OptionCard
            key={value}
            title={value}
            isSelected={ipRir === value}
            onClick={() => setIpRir(value)}
          />
        ))}
      </div>
    </OrderSection>
  );
};
