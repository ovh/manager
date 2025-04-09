import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { OrderContext } from '../order.context';
import { Ipv6Options } from '../order.constant';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { PriceDescription } from '@/components/PriceDescription/PriceDescription';

export const AdditionalOptionsSection: React.FC = () => {
  const { selectedOptions, setSelectedOptions } = React.useContext(
    OrderContext,
  );
  const { t } = useTranslation('order');

  return (
    <OrderSection
      title={t('additional_options_selection_title')}
      description={t('additional_options_selection_description')}
    >
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          title={t('new_prefix_ipv6_card_title')}
          description={t('new_prefix_ipv6_card_description')}
          isSelected={selectedOptions.includes(Ipv6Options.newPrefix56)}
          onClick={() =>
            setSelectedOptions((options) =>
              Array.from(new Set([...options, Ipv6Options.newPrefix56])),
            )
          }
        >
          <OdsText preset={ODS_TEXT_PRESET.heading4}>
            <PriceDescription price={0} />
          </OdsText>
        </OptionCard>
      </div>
    </OrderSection>
  );
};
