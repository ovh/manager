import {
  Divider,
  DIVIDER_COLOR,
  DIVIDER_SPACING,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import PriceCard from '@/common/components/Card/PriceCard';

interface DnsZoneOrderProps {
  readonly isZoneActivation: boolean;
  readonly dnssecSelected: boolean;
  readonly dnssecSupported: boolean;
  readonly onDnssecSelectedChange: () => void;
}

export default function DnsZoneOrder({
  isZoneActivation,
  dnssecSelected,
  dnssecSupported,
  onDnssecSelectedChange,
}: DnsZoneOrderProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);

  return (
    <div className="min-w-[65rem] w-fit" data-testid="dnsZone-order">
      <div className="pb-5">
        {!isZoneActivation && [
          <Text key={"heading"} preset={TEXT_PRESET.heading4}>
            {t('domain_tab_DNS_anycast_order_activate_zone')}
          </Text>,
          <Message
            key={"message"}
            className="w-full mt-4"
            color={MESSAGE_COLOR.warning}
            dismissible={false}
            data-testid="dns-warning-message"
          >
            <MessageIcon name={ICON_NAME.triangleExclamation} />
            <MessageBody>
              {t('domain_tab_DNS_anycast_order_activate_zone_message')}
            </MessageBody>
          </Message>
        ]}
        {isZoneActivation && (
          <Message
            className="w-full mt-4"
            color={MESSAGE_COLOR.information}
            dismissible={false}
            data-testid="dns-warning-information"
          >
            <MessageIcon name={ICON_NAME.circleInfo} />
            <MessageBody>
              {t('domain_order_activate_zone_message')}
            </MessageBody>
          </Message>)}
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
