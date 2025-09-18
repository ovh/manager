import {
  Divider,
  DIVIDER_COLOR,
  DIVIDER_SPACING,
  Message,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PriceCard from '@/domain/components/Card/PriceCard';

interface DnsZoneOrderProps {
  readonly dnssecSelected: boolean;
  readonly dnssecSupported: boolean;
  readonly onDnssecSelectedChange: () => void;
}

export default function DnsZoneOrder({
  dnssecSelected,
  dnssecSupported,
  onDnssecSelectedChange,
}: DnsZoneOrderProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);

  return (
    <div className="min-w-[65rem] w-fit" data-testid="dnsZone-order">
      <div className="pb-5">
        <Text preset={TEXT_PRESET.heading4}>
          {t('domain_tab_DNS_anycast_order_activate_zone')}
        </Text>
        <Message
          className="w-full mt-4"
          color="warning"
          dismissible={false}
          data-testid="dns-warning-message"
        >
          <MessageIcon name="triangle-exclamation" />
          <MessageBody>
            {t('domain_tab_DNS_anycast_order_activate_zone_message')}
          </MessageBody>
        </Message>
      </div>
      <div className="flex gap-5 pb-8">
        <PriceCard
          checked={true}
          footer={
            <Text
              preset={TEXT_PRESET.heading4}
              className="pl-5 text-[--ods-color-primary-500]"
            >
              {t('domain_tab_DNS_anycast_order_include')}
            </Text>
          }
          title="Zone DNS"
          disabled={true}
        />
        {dnssecSupported && (
          <PriceCard
            onCheckBoxChange={onDnssecSelectedChange}
            checked={dnssecSelected}
            footer={
              <Text
                preset={TEXT_PRESET.heading4}
                className="pl-5 text-[--ods-color-primary-500]"
              >
                {t('domain_tab_DNS_anycast_order_include')}
              </Text>
            }
            title="DNSSEC"
          />
        )}
      </div>
      <Divider color={DIVIDER_COLOR.primary} spacing={DIVIDER_SPACING._8} />
    </div>
  );
}
