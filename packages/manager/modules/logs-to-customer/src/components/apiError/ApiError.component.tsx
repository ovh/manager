import { NAMESPACES } from '@/LogsToCustomer.translations';
import { Button, Message } from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface IError {
  testId: string;
  error: Error | null;
  onRetry: () => void;
}

export default function ApiError({ error, onRetry, testId }: Readonly<IError>) {
  const { t } = useTranslation(NAMESPACES.ERROR);

  return (
    <div className="flex flex-col gap-2" data-testid={testId}>
      <Message color="critical" dismissible={false}>
        <span>
          {`${t('error_title')}: `}
          <strong>{error?.message || 'Unknown error'}</strong>
        </span>
      </Message>
      <Button size="sm" onClick={onRetry}>{t('error_retry_button')}</Button>
    </div>
  );
}
