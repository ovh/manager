import { Message, MessageBody, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TrackingMessage() {
  const { t } = useTranslation('dashboard');
  return (
    <Message dismissible={false} className="w-full">
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
