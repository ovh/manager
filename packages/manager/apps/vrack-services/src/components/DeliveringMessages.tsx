import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DetailedOrder } from '@/api';

export type DeliveringMessagesProps = {
  message: string;
  orders?: DetailedOrder[];
};

export const DeliveringMessages: React.FC<DeliveringMessagesProps> = ({
  message,
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
            key={`delivering-message-${order.orderId}`}
            className="my-5"
            type={ODS_MESSAGE_TYPE.info}
          >
            {message
              .replace('{{date}}', date.toLocaleDateString(i18n.language))
              .replace('{{time}}', `${date.getHours()}:${date.getMinutes()}`)
              .replace('{{status}}', t(`orderStatus-${order.status}`))}
          </OsdsMessage>
        );
      })}
    </>
  );
};
