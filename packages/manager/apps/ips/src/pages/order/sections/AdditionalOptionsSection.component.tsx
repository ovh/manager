import React from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { PriceDescription } from '@/components/PriceDescription/PriceDescription';

import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { Ipv6Options } from '../order.constant';
import { OrderContext } from '../order.context';

export const AdditionalOptionsSection: React.FC = () => {
  const { t } = useTranslation('order');
  const { selectedOptions, setSelectedOptions } = React.useContext(
    OrderContext,
  );
  const { trackClick } = useOvhTracking();

  return (
    <OrderSection
      title={t('additional_options_selection_title')}
      description={t('additional_options_selection_description')}
    >
      <div className="grid grid-cols-2 gap-4">
        <OptionCard
          title={t('new_prefix_ipv6_card_title')}
          description={t('new_prefix_ipv6_card_description')}
          isSelected={selectedOptions?.includes(Ipv6Options.newPrefix56)}
          onClick={() => {
            trackClick({
              actionType: 'action',
              buttonType: ButtonType.button,
              location: PageLocation.funnel,
              actions: ['select_new-prefix'],
            });
            setSelectedOptions((options) =>
              Array.from(new Set([...options, Ipv6Options.newPrefix56])),
            );
          }}
        >
          <Text preset={TEXT_PRESET.heading4}>
            <PriceDescription price={0} />
          </Text>
        </OptionCard>
      </div>
    </OrderSection>
  );
};
