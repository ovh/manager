import React from 'react';

import { useTranslation } from 'react-i18next';

import { Button, MESSAGE_COLOR, Message, MessageBody } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/LogsToCustomer.translations';

export interface IError {
  testId: string;
  error: Error;
  onRetry: () => void;
}

export default function ApiError({ error, onRetry, testId }: Readonly<IError>) {
  const { t } = useTranslation(NAMESPACES.ERROR);

  return (
    <div className="flex flex-col gap-2" data-testid={testId}>
      <Message color={MESSAGE_COLOR.critical} dismissible={false}>
        <MessageBody>
          {`${t('error_title')}: `}
          <strong>{error.message}</strong>
        </MessageBody>
      </Message>
      <Button size="sm" onClick={onRetry}>
        {t('error_retry_button')}
      </Button>
    </div>
  );
}
