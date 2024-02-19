import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import React from 'react';
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
          <OsdsMessage
            className="mt-5"
            type={ODS_MESSAGE_TYPE.info}
            key={`delivering-message-${order.orderId}`}
          >
            {t(messageKey, {
              date: date.toLocaleDateString(i18n.language.replace('_', '-')),
              time: `${date.getHours()}:${date.getMinutes()}`,
              status: t(`orderStatus-${order.status}`),
            })}
          </OsdsMessage>
        );
      })}
    </>
  );
};
