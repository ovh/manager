import React from 'react';

import { useTranslation } from 'react-i18next';

import { MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';

import type { DetailedOrder } from '@ovh-ux/manager-module-order';

import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export type DeliveringMessagesProps = {
  messageKey: string;
  orders?: DetailedOrder[];
};

export const DeliveringMessages: React.FC<DeliveringMessagesProps> = ({
  messageKey,
  orders = [],
}) => {
  const { t, i18n } = useTranslation(TRANSLATION_NAMESPACES.common);

  return orders.length === 0 ? (
    <></>
  ) : (
    <>
      {orders.map((order) => {
        const date = new Date(order.date);
        const hours = date.getHours();
        const min = date.getMinutes();
        const time = `${hours < 10 ? '0' : ''}${hours}:${min < 10 ? '0' : ''}${min}`;

        return (
          <Message
            className="mt-5"
            color={MESSAGE_COLOR.information}
            key={`delivering-message-${order.orderId}`}
            dismissible={false}
          >
            <MessageIcon name="circle-info" />
            <MessageBody>
              {t(messageKey, {
                date: date.toLocaleDateString(i18n.language.replace('_', '-')),
                time,
                status: t(`orderStatus-${order.status}`),
              })}
            </MessageBody>
          </Message>
        );
      })}
    </>
  );
};
