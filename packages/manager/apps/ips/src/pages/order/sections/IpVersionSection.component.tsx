import React from 'react';
import { useTranslation } from 'react-i18next';
import { IpVersion } from '@/types';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { useCatalogLowestPrice } from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';
import { IpVersionOptionCard } from '@/components/ipVersionOptionCard/IpVersionOptionCard.component';

export const IpVersionSection: React.FC = () => {
  const { ipVersion, setIpVersion } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const {
    ipv4LowestPrice,
    ipv6LowestPrice,
    isLoading,
  } = useCatalogLowestPrice();

  return (
    <OrderSection
      title={t('ip_version_title')}
      description={t('ip_version_description')}
    >
      <div className="grid grid-cols-2 gap-3">
        <IpVersionOptionCard
          title={t('ipv4_card_title')}
          description={t('ipv4_card_description')}
          isSelected={ipVersion === IpVersion.ipv4}
          onClick={() => setIpVersion(IpVersion.ipv4)}
          isLoading={isLoading}
          isStartingPrice
          price={ipv4LowestPrice}
          priceSuffix={t('per_ip')}
        />
        <IpVersionOptionCard
          title={t('ipv6_card_title')}
          description={t('ipv6_card_description')}
          isSelected={ipVersion === IpVersion.ipv6}
          onClick={() => setIpVersion(IpVersion.ipv6)}
          isLoading={isLoading}
          price={ipv6LowestPrice}
        />
      </div>
    </OrderSection>
  );
};
