import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface IError {
  testId: string;
  error: Error;
  onRetry: () => void;
}

export default function ApiError({ error, onRetry, testId }: Readonly<IError>) {
  const { t } = useTranslation('error');

  return (
    <div className="flex flex-col gap-4" data-testid={testId}>
      <OdsMessage color="danger" isDismissible={false}>
        <span>
          {`${t('error_title')}: `}
          <strong>{error.message}</strong>
        </span>
      </OdsMessage>
      <OdsButton size="sm" onClick={onRetry} label={t('error_retry_button')} />
    </div>
  );
}
