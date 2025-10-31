import React from 'react';
import { useTranslation } from 'react-i18next';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  OdsSelect,
  OdsText,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getPrice, getPriceTextFormatted } from '@/components/price';
import {
  DEFAULT_PRICING_MODE,
  IpOffer,
  MAX_IP_QUANTITY,
  MIN_IP_QUANTITY,
} from '../order.constant';
import { isRegionInEu } from '@/components/RegionSelector/region-selector.utils';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { PriceDescription } from '@/components/PriceDescription/PriceDescription';
import {
  useAdditionalIpPricings,
  useCatalogLowestPrice,
} from '@/data/hooks/catalog';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
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
      <div className="grid grid-cols-2 gap-3">
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
            }}
          >
            <div className="flex flex-col justify-center min-h-14">
              <OdsQuantity
                name="additional_ip_quantity"
                min={MIN_IP_QUANTITY}
                max={MAX_IP_QUANTITY}
                onOdsChange={(event) => setIpQuantity(event.target.value)}
                value={ipQuantity}
              />
              <OdsText preset={ODS_TEXT_PRESET.heading4}>
                <PriceDescription price={ipv4LowestPrice * ipQuantity} />
              </OdsText>
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
                setSelectedPlanCode(ipBlockPricingList[0].value);
                setPricingMode(ipBlockPricingList[0].pricingMode);
              }
            }}
            isLoading={isLoading}
          >
            <div className="flex flex-col justify-center min-h-14">
              <OdsSelect
                key={ipBlockPricingList.reduce(
                  (result, { value }) => result + value,
                  '',
                )}
                name="ip_block_plancode_select"
                value={selectedPlanCode}
                onOdsChange={(event) => {
                  if (
                    ipBlockPricingList.some(
                      (pricing) => pricing.value === event.target.value,
                    )
                  ) {
                    setSelectedOffer(IpOffer.blockAdditionalIp);
                    setSelectedPlanCode(event.target.value as string);
                    setPricingMode(
                      ipBlockPricingList.find(
                        (p) => p.value === event.target.value,
                      )?.pricingMode || DEFAULT_PRICING_MODE,
                    );
                  }
                }}
              >
                {ipBlockPricingList.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </OdsSelect>
            </div>
          </OptionCard>
        )}
      </div>
    </OrderSection>
  );
};
