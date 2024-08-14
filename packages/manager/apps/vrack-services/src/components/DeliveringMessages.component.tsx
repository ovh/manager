import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
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
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(messageKey, {
                date: date.toLocaleDateString(i18n.language.replace('_', '-')),
                time: `${date.getHours()}:${date.getMinutes()}`,
                status: t(`orderStatus-${order.status}`),
              })}
            </OsdsText>
          </OsdsMessage>
        );
      })}
    </>
  );
};
