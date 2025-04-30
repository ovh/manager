import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { useCatalog, CONFIG_NAME } from '@/utils/getCatalog';
import { ByoipContext } from '../Byoip.context';
import { getConfigValues } from '@/utils/getConfigValues';

export const RirSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { data: catalog, isLoading } = useCatalog();
  const { ipRir, setIpRir } = React.useContext(ByoipContext);

  const ipRirValues = getConfigValues(
    catalog?.details.product.configurations,
    CONFIG_NAME.IPRIR,
  ) as string[];

  if (isLoading) {
    return <div>Loading...</div>;
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
