import { useTranslation } from 'react-i18next';

import { Message, MessageBody, MessageIcon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

type FloatingIPWarningProps = {
  price: { hour: number } | null;
  getFormattedPrice: (price: number) => string;
};

export const FloatingIPEnableWarning = ({ price, getFormattedPrice }: FloatingIPWarningProps) => {
  const { t } = useTranslation('listing');
  return (
    <Message color="warning" dismissible={false} className="mb-6">
      <MessageIcon name="triangle-exclamation" />
      <MessageBody>
        <>
          <Text preset={TEXT_PRESET.heading5} className="mb-4 text-[--ods-color-warning-700]">
            {t('listing:kube_list_node_pools_floating_ip_warning_enable_title')}
          </Text>
          {t('listing:kube_list_node_pools_floating_ip_warning_enable_description', {
            price: price ? getFormattedPrice(price.hour) : '',
          })}
        </>
      </MessageBody>
    </Message>
  );
};

export const FloatingIPDisableWarning = () => {
  const { t } = useTranslation('listing');
  return (
    <Message color="critical" dismissible={false} className="mb-6">
      <MessageIcon name={'triangle-exclamation'} />
      <MessageBody>
        <>
          <Text preset={TEXT_PRESET.heading5} className="mb-4 text-[--ods-color-critical-700]">
            {t('listing:kube_list_node_pools_floating_ip_warning_disable_title')}
          </Text>
          {t('listing:kube_list_node_pools_floating_ip_warning_disable_description')}
        </>
      </MessageBody>
    </Message>
  );
};
