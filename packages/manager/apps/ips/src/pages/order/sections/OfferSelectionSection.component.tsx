import React from 'react';
import { useTranslation } from 'react-i18next';
import { OfferCard } from '@/components/OfferCard/OfferCard.component';
import { IpOffer, IpVersion } from '../order.constant';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import {
  useAdditionalIpBlockPricings,
  useIpv4LowestPrice,
} from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';

export const OfferSelectionSection: React.FC = () => {
  const {
    ipVersion,
    selectedRegion,
    selectedOffer,
    setSelectedOffer,
    selectedPlanCode,
    setSelectedPlanCode,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { price } = useIpv4LowestPrice();
  const { pricingList, isLoading } = useAdditionalIpBlockPricings(
    selectedRegion,
    ipVersion,
  );

  React.useEffect(() => {
    if (
      pricingList &&
      (!selectedPlanCode ||
        !pricingList.some(({ value }) => value === selectedPlanCode))
    ) {
      setSelectedPlanCode(pricingList?.[0]?.value);
    }
  }, [pricingList, selectedPlanCode]);

  return (
    <OrderSection title={t('offer_selection_title')}>
      <div className="grid grid-cols-2 gap-3">
        <OfferCard
          title={t('additional_ip_block_card_title')}
          description={t('additional_ip_block_card_description')}
          price={price}
          isSelected={selectedOffer === IpOffer.blockAdditionalIp}
          onClick={() => setSelectedOffer(IpOffer.blockAdditionalIp)}
          setSelectedPlanCode={setSelectedPlanCode}
          selectedPlanCode={selectedPlanCode}
          options={pricingList}
          isLoading={isLoading}
        />
      </div>
    </OrderSection>
  );
};
