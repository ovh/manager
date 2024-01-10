import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DetailedOrder } from '@/api';

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
            key={`delivering-message-${order.orderId}`}
            className="my-5"
            type={ODS_MESSAGE_TYPE.info}
          >
            {t(messageKey, {
              date: date.toLocaleDateString(i18n.language),
              time: `${date.getHours()}:${date.getMinutes()}`,
              status: t(`orderStatus-${order.status}`),
              interpolation: { escapeValue: false },
            })}
          </OsdsMessage>
        );
      })}
    </>
  );
};
