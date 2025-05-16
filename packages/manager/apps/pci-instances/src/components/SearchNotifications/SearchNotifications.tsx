import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { NotificationType } from '@ovh-ux/manager-react-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { FC } from 'react';
import { useUrlSearchMessages } from '@/hooks/url/useUrlSearchMessages';

const getOdsMessageColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_MESSAGE_TYPE.success;
    case NotificationType.Error:
      return ODS_MESSAGE_TYPE.error;
    case NotificationType.Warning:
      return ODS_MESSAGE_TYPE.warning;
    case NotificationType.Info:
      return ODS_MESSAGE_TYPE.info;
    default:
      return ODS_MESSAGE_TYPE.info;
  }
};
const getOdsTextColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_TEXT_COLOR_INTENT.success;
    case NotificationType.Error:
      return ODS_TEXT_COLOR_INTENT.error;
    case NotificationType.Warning:
      return ODS_TEXT_COLOR_INTENT.warning;
    case NotificationType.Info:
      return ODS_TEXT_COLOR_INTENT.info;
    default:
      return ODS_TEXT_COLOR_INTENT.info;
  }
};

export const SearchNotifications: FC = () => {
  const { messages, dismissMessage } = useUrlSearchMessages();

  return (
    <>
      {Object.entries(messages).map(([key, messagesList]) => {
        const messageType = key as NotificationType;
        return (
          <div key={key}>
            {messagesList.map((m) => (
              <OsdsMessage
                key={m}
                className={'mb-2'}
                type={getOdsMessageColor(messageType)}
                removable
                onOdsRemoveClick={() => dismissMessage(messageType, m)}
              >
                <OsdsText
                  color={getOdsTextColor(messageType)}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                >
                  {m}
                </OsdsText>
              </OsdsMessage>
            ))}
          </div>
        );
      })}
    </>
  );
};
