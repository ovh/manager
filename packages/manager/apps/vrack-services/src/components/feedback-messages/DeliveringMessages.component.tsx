import React from 'react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DetailedOrder } from '@ovh-ux/manager-module-order';

export type DeliveringMessagesProps = {
  messageKey: string;
  orders?: DetailedOrder[];
};

export const DeliveringMessages: React.FC<DeliveringMessagesProps> = ({
  messageKey,
  orders = [],
}) => {
  const { t, i18n } = useTranslation('vrack-services');

  return orders.length === 0 ? (
    <></>
  ) : (
    <>
      {orders.map((order) => {
        const date = new Date(order.date);
        return (
          <OdsMessage
            className="block mt-5"
            color={ODS_MESSAGE_COLOR.information}
            key={`delivering-message-${order.orderId}`}
            isDismissible={false}
          >
            {t(messageKey, {
              date: date.toLocaleDateString(i18n.language.replace('_', '-')),
              time: `${date.getHours()}:${date.getMinutes()}`,
              status: t(`orderStatus-${order.status}`),
            })}
          </OdsMessage>
        );
      })}
    </>
  );
};
