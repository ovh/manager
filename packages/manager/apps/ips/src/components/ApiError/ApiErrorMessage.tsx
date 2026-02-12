import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  Message,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';

import { ApiError } from '@ovh-ux/manager-core-api';

import { TRANSLATION_NAMESPACES } from '@/utils';

export const useApiErrorMessage = (error?: ApiError | null) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.error);

  const errorMessage = error?.response?.data?.message || error?.message;
  const ovhQueryId = error?.response?.headers?.['x-ovh-queryid'] as string;

  if (!errorMessage) {
    return undefined;
  }

  return ovhQueryId
    ? t('managerApiError', { error: errorMessage, ovhQueryId })
    : t('managerApiErrorWithoutRequestId', { error: errorMessage });
};

export type ApiErrorMessageProps = {
  error?: ApiError | null;
  isDismissible?: boolean;
  className?: string;
};

export const ApiErrorMessage: React.FC<ApiErrorMessageProps> = ({
  error,
  isDismissible = false,
  className = '',
}) => {
  const errorMessage = useApiErrorMessage(error);

  if (!errorMessage) {
    return <></>;
  }

  return (
    <Message
      dismissible={isDismissible}
      className={`max-w-full ${className}`}
      color={MESSAGE_COLOR.critical}
    >
      <Icon name={ICON_NAME.hexagonExclamation} />
      <MessageBody>
        <span
          className="text-sm break-all"
          dangerouslySetInnerHTML={{ __html: errorMessage }}
        />
      </MessageBody>
    </Message>
  );
};
