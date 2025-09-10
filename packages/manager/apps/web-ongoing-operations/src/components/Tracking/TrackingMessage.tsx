import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TrackingMessage() {
  const { t } = useTranslation('dashboard');
  return (
    <Message
      color={MESSAGE_COLOR.information}
      dismissible={false}
      className="w-full"
    >
      <MessageIcon name={ICON_NAME.circleInfo} />
      <MessageBody className="flex flex-col">
        <Text preset={TEXT_PRESET.heading6} className="block">
          {t('domain_operations_progress_instructions')}
        </Text>
        <Text preset={TEXT_PRESET.span} className="block">
          {t('domain_operations_progress_instructions_7')}
        </Text>
      </MessageBody>
    </Message>
  );
}
