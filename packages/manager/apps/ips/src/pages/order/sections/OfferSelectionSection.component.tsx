import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OvhSubsidiary,
  getPrice,
  getPriceTextFormatted,
} from '@ovh-ux/manager-react-components';
import {
  OdsSelect,
  OdsSkeleton,
  OdsText,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { IpOffer } from '../order.constant';
import { isRegionInEu } from '@/components/RegionSelector/region-selector.utils';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import {
  OptionCard,
  PriceDescription,
} from '@/components/OptionCard/OptionCard.component';
import {
  useAdditionalIpBlockPricings,
  useIpv4LowestPrice,
} from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';
import {
  hasAdditionalIpBlockOffer,
  hasAdditionalIpOffer,
} from '../order.utils';

export const OfferSelectionSection: React.FC = () => {
  const {
    ipVersion,
    selectedServiceType,
    selectedRegion,
    selectedOffer,
    setSelectedOffer,
    selectedPlanCode,
    ipQuantity,
    setIpQuantity,
    setSelectedPlanCode,
  } = React.useContext(OrderContext);
  const { t, i18n } = useTranslation('order');
  const { price } = useIpv4LowestPrice();
  const { environment } = React.useContext(ShellContext);
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
        {hasAdditionalIpOffer(selectedServiceType) && (
          <OptionCard
            title={t('additional_ip_card_title')}
            subtitle={<PriceDescription price={price} />}
            description={t(
              `additional_ip_card_${
                isRegionInEu(selectedRegion) ? 'ripe' : 'arin'
              }_description`,
              {
                price: getPriceTextFormatted(
                  environment.user.ovhSubsidiary as OvhSubsidiary,
                  i18n.language,
                  getPrice(price, 0),
                ),
              },
            )}
            isSelected={selectedOffer === IpOffer.additionalIp}
            onClick={() => setSelectedOffer(IpOffer.additionalIp)}
          >
            <OdsQuantity
              name="additional_ip_quantity"
              min={1}
              max={64}
              onOdsChange={(event) => {
                setSelectedOffer(IpOffer.additionalIp);
                setIpQuantity(event.target.value);
              }}
              value={ipQuantity}
            />
            <OdsText preset={ODS_TEXT_PRESET.heading4}>
              <PriceDescription price={price * ipQuantity} />
            </OdsText>
          </OptionCard>
        )}
        {hasAdditionalIpBlockOffer(selectedServiceType) && (
          <OptionCard
            title={t('additional_ip_block_card_title')}
            description={t('additional_ip_block_card_description')}
            subtitle={
              <PriceDescription suffix={t('per_ip_full')} price={price} />
            }
            isSelected={selectedOffer === IpOffer.blockAdditionalIp}
            onClick={() => setSelectedOffer(IpOffer.blockAdditionalIp)}
          >
            {isLoading ? (
              <OdsSkeleton />
            ) : (
              <OdsSelect
                key={pricingList.reduce(
                  (result, { value }) => result + value,
                  '',
                )}
                name="ip_block_plancode_select"
                value={selectedPlanCode}
                onOdsChange={(event) => {
                  setSelectedOffer(IpOffer.blockAdditionalIp);
                  setSelectedPlanCode(event.target.value as string);
                }}
              >
                {pricingList.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </OdsSelect>
            )}
          </OptionCard>
        )}
      </div>
    </OrderSection>
  );
};
