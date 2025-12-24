import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { CONFIG_NAME, useGetCatalog } from '@/data/hooks/catalog/useGetCatalog';

import { ByoipContext } from '../Byoip.context';
import { getConfigValues } from '../Byoip.utils';

export const RirSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { data: catalog, isLoading } = useGetCatalog();
  const { ipRir, setIpRir } = React.useContext(ByoipContext);
  const { trackClick } = useOvhTracking();

  const ipRirValues = getConfigValues(
    catalog?.details?.product.configurations,
    CONFIG_NAME.IPRIR,
  ) as string[];

  return (
    <OrderSection
      title={t('rir_selection_title')}
      description={t('rir_selection_description')}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {ipRirValues.map((value) => (
          <OptionCard
            key={value}
            title={value}
            subtitle={t(`rir_selection_${value}_description`)}
            hasRadioButton={true}
            isSelected={ipRir === value}
            onClick={() => {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                location: PageLocation.funnel,
                actions: [`select_${value.toLowerCase()}`],
              });
              setIpRir(value);
            }}
          />
        ))}
      </div>
    </OrderSection>
  );
};
