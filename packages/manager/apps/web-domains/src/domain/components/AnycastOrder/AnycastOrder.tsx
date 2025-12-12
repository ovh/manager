import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { UserLocales } from '@ovh-ux/manager-config';
import PriceCard from '@/domain/components/Card/PriceCard';
import { useGetOrderCatalogDns } from '@/domain/hooks/data/query';
import { ANYCAST_ORDER_CONSTANT } from '@/domain/constants/order';
import { order } from '@/domain/types/orderCatalog';
import Loading from '@/domain/components/Loading/Loading';

interface AnycastOrderComponentProps {
  readonly displayTitle: boolean;
  readonly subsidiary: OvhSubsidiary;
  readonly userLocal: UserLocales;
}

export default function AnycastOrderComponent({
  displayTitle,
  subsidiary,
  userLocal,
}: AnycastOrderComponentProps) {
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
          checked={true}
          disabled={true}
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
