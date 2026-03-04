import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  SelectContent,
  Quantity,
  Select,
  Text,
  SelectControl,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';

import { OvhSubsidiary } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { PriceDescription } from '@/components/PriceDescription/PriceDescription';
import { isRegionInEu } from '@/components/RegionSelector/region-selector.utils';
import { getPrice, getPriceTextFormatted } from '@/components/price';
import {
  useAdditionalIpPricings,
  useCatalogLowestPrice,
} from '@/data/hooks/catalog';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';

import {
  DEFAULT_PRICING_MODE,
  IpOffer,
  MAX_IP_QUANTITY,
  MIN_IP_QUANTITY,
} from '../order.constant';
import { OrderContext } from '../order.context';
import {
  hasAdditionalIpBlockOffer,
  hasAdditionalIpOffer,
} from '../order.utils';

export const OfferSelectionSection: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    selectedServiceType,
    selectedRegion,
    selectedOffer,
    setSelectedOffer,
    selectedPlanCode,
    ipQuantity,
    setIpQuantity,
    setSelectedPlanCode,
    setPricingMode,
  } = React.useContext(OrderContext);
  const { t, i18n } = useTranslation('order');
  const { ipv4LowestPrice } = useCatalogLowestPrice();
  const { environment } = React.useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });
  const {
    additionalIpPlanCode,
    ipBlockPricingList,
    isLoading,
  } = useAdditionalIpPricings({
    ipVersion,
    region: region || selectedRegion,
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });

  return (
    <OrderSection title={t('offer_selection_title')}>
      <div className="grid grid-cols-2 gap-4">
        {hasAdditionalIpOffer(selectedServiceType) && (
          <OptionCard
            title={t('additional_ip_card_title')}
            className="pt-4"
            subtitle={<PriceDescription price={ipv4LowestPrice} />}
            description={t(
              `additional_ip_card_${
                isRegionInEu(region || selectedRegion) ? 'ripe' : 'arin'
              }_description`,
              {
                price: getPriceTextFormatted(
                  environment.user.ovhSubsidiary as OvhSubsidiary,
                  i18n.language,
                  getPrice(ipv4LowestPrice, 0),
                ),
              },
            )}
            isSelected={selectedOffer === IpOffer.additionalIp}
            onClick={() => {
              setSelectedOffer(IpOffer.additionalIp);
              setSelectedPlanCode(additionalIpPlanCode);
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                location: PageLocation.funnel,
                actions: ['select_additional-ip'],
              });
            }}
          >
            <div className="flex min-h-14 flex-col justify-center">
              <Quantity
                name="additional_ip_quantity"
                min={MIN_IP_QUANTITY}
                max={MAX_IP_QUANTITY}
                onValueChange={(event) =>
                  setIpQuantity(parseInt(event.value, 10) || MIN_IP_QUANTITY)
                }
                value={ipQuantity?.toString() || MIN_IP_QUANTITY.toString()}
              />
              <Text preset={TEXT_PRESET.heading4}>
                <PriceDescription
                  price={
                    ipv4LowestPrice && ipQuantity
                      ? ipv4LowestPrice * ipQuantity
                      : 0
                  }
                />
              </Text>
            </div>
          </OptionCard>
        )}
        {hasAdditionalIpBlockOffer(selectedServiceType) && (
          <OptionCard
            isDisabled={isLoading}
            title={t('additional_ip_block_card_title')}
            className="pt-4"
            description={t('additional_ip_block_card_description')}
            subtitle={
              <PriceDescription
                suffix={t('per_ip_full')}
                price={ipv4LowestPrice}
              />
            }
            isSelected={selectedOffer === IpOffer.blockAdditionalIp}
            onClick={() => {
              setSelectedOffer(IpOffer.blockAdditionalIp);
              if (
                ipBlockPricingList?.length > 0 &&
                ipBlockPricingList?.every(
                  (pricing) => pricing.value !== selectedPlanCode,
                )
              ) {
                const firstPricing = ipBlockPricingList[0];
                setSelectedPlanCode(firstPricing?.value);
                setPricingMode(firstPricing?.pricingMode);
              }
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                location: PageLocation.funnel,
                actions: ['select_block-additional-ip'],
              });
            }}
            loading={isLoading}
          >
            <div className="flex min-h-14 flex-col justify-center">
              <Select
                key={ipBlockPricingList.reduce(
                  (result, { value }) => result + value,
                  '',
                )}
                name="ip_block_plancode_select"
                value={[selectedPlanCode]}
                onValueChange={(event) => {
                  const newValue = event.value?.[0];
                  if (
                    ipBlockPricingList.some(
                      (pricing) => pricing.value === newValue,
                    )
                  ) {
                    setSelectedOffer(IpOffer.blockAdditionalIp);
                    setSelectedPlanCode(newValue);
                    setPricingMode(
                      ipBlockPricingList.find((p) => p.value === newValue)
                        ?.pricingMode || DEFAULT_PRICING_MODE,
                    );
                  }
                }}
                items={ipBlockPricingList.map(({ label, value }) => ({
                  label,
                  value,
                }))}
              >
                <SelectContent />
                <SelectControl />
              </Select>
            </div>
          </OptionCard>
        )}
      </div>
    </OrderSection>
  );
};
