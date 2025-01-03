import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { IpVersion } from './order.constant';
import { OrderSection } from './OrderSection.component';
import { useIpv4LowestPrice } from '@/data/hooks/catalog';

export type IpVersionSectionProps = {
  ipVersion?: IpVersion;
  setIpVersion: React.Dispatch<React.SetStateAction<IpVersion>>;
};

export const IpVersionSection: React.FC<IpVersionSectionProps> = ({
  ipVersion,
  setIpVersion,
}) => {
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
          price={price}
          isSelected={ipVersion === IpVersion.ipv4}
          onClick={() => setIpVersion(IpVersion.ipv4)}
        />
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
          price={0}
          isDisabled
          isSelected={ipVersion === IpVersion.ipv6}
          onClick={() => setIpVersion(IpVersion.ipv6)}
        />
      </div>
    </OrderSection>
  );
};
