import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
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
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.error}
        type={ODS_MESSAGE_TYPE.error}
      >
        <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
          <div>{t('error_title')}</div>
          <strong>{error.message}</strong>
        </OsdsText>
      </OsdsMessage>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={onRetry}
      >
        {t('error_retry_button')}
      </OsdsButton>
    </div>
  );
}
