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
import { useIpv4LowestPrice } from '@/data/hooks/catalog';
import { OrderContext } from '../order.context';

export const IpVersionSection: React.FC = () => {
  const { ipVersion, setIpVersion } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { price } = useIpv4LowestPrice();

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
            price={price}
            suffix={t('per_ip')}
          />
        </OptionCard>
        <OptionCard
          title={
            <>
              {t('ipv6_card_title')}
              <OdsBadge
                className="ml-2 inline-block"
                label={t('ipv6_card_badge_label')}
                color={ODS_BADGE_COLOR.beta}
                size={ODS_BADGE_SIZE.sm}
              />
            </>
          }
          description={t('ipv6_card_description')}
          isDisabled
          isSelected={ipVersion === IpVersion.ipv6}
          onClick={() => setIpVersion(IpVersion.ipv6)}
        >
          <PriceDescription price={0} />
        </OptionCard>
      </div>
    </OrderSection>
  );
};
