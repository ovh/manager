import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import {
  OptionCard,
  PriceDescription,
} from '@/components/OptionCard/OptionCard.component';
import { IpVersion } from '../order.constant';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { useCatalogLowestPrice } from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';

export const IpVersionSection: React.FC = () => {
  const { ipVersion, setIpVersion } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { ipv4LowestPrice, ipv6LowestPrice } = useCatalogLowestPrice();

  return (
    <OrderSection
      title={t('ip_version_title')}
      description={t('ip_version_description')}
    >
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          title={t('ipv4_card_title')}
          description={t('ipv4_card_description')}
          isSelected={ipVersion === IpVersion.ipv4}
          onClick={() => setIpVersion(IpVersion.ipv4)}
        >
          <PriceDescription
            isStartingPrice
            price={ipv4LowestPrice}
            suffix={t('per_ip')}
          />
        </OptionCard>
        <OptionCard
          title={t('ipv6_card_title')}
          description={t('ipv6_card_description')}
          isSelected={ipVersion === IpVersion.ipv6}
          onClick={() => setIpVersion(IpVersion.ipv6)}
        >
          <PriceDescription price={ipv6LowestPrice} />
        </OptionCard>
      </div>
    </OrderSection>
  );
};
