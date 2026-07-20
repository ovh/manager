import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { UserLocales } from '@ovh-ux/manager-config';
import PriceCard from '@/common/components/Card/PriceCard';
import { useGetOrderCatalogDns } from '@/common/hooks/data/query';
import { ANYCAST_ORDER_CONSTANT } from '@/common/constants/order';
import { order } from '@/common/types/orderCatalog';
import Loading from '@/common/components/Loading/Loading';

interface DnsOrderCardProps {
  readonly isZoneActivation: boolean;
  readonly displayTitle: boolean;
  readonly subsidiary: OvhSubsidiary;
  readonly userLocal: UserLocales;
  readonly anycastSelected: boolean;
  readonly onAnycastCheckBoxChange: () => void;
}

export default function DnsOrderCard({
  isZoneActivation,
  displayTitle,
  subsidiary,
  userLocal,
  anycastSelected,
  onAnycastCheckBoxChange,
}: DnsOrderCardProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);

  const { dnsCatalog, isFetchingDnsCatalog } = useGetOrderCatalogDns(
    subsidiary,
  );
  const priceDetails = dnsCatalog?.addons
    ?.find(
      (addon) => addon.planCode === ANYCAST_ORDER_CONSTANT.ANYCAST_PLAN_CODE,
    )
    .pricings.find((price) =>
      price.capacities.includes(
        order.cart.GenericProductPricingCapacitiesEnum.INSTALLATION,
      ),
    );

  if (isFetchingDnsCatalog) {
    return <Loading />;
  }

  return (
    <>
      {displayTitle && (
        <Text
          className="pt-8"
          preset={TEXT_PRESET.heading4}
          data-testid="anycast-title"
        >
          {t('domain_tab_DNS_anycast_order')}
        </Text>
      )}
      <Text>{t('domain_tab_DNS_anycast_order_description')}</Text>
      <Text>
        <Trans
          i18nKey="domain_tab_DNS_anycast_order_description_expiration"
          t={t}
          components={{
            Price: (
              <Price
                value={priceDetails?.price}
                locale={userLocal}
                ovhSubsidiary={subsidiary}
                tax={priceDetails?.tax}
                intervalUnit={IntervalUnitType.year}
              />
            ),
          }}
        />
      </Text>
      <div className="flex gap-5 pt-5 pb-10">
        <PriceCard
          checked={anycastSelected}
          disabled={!isZoneActivation}
          onCheckBoxChange={onAnycastCheckBoxChange}
          footer={
            <span className="pl-5">
              <Price
                value={priceDetails?.price}
                locale={userLocal}
                ovhSubsidiary={subsidiary}
                tax={priceDetails?.tax}
                intervalUnit={IntervalUnitType.year}
              />
            </span>
          }
          title="DNS Anycast"
        />
      </div>
    </>
  );
}
