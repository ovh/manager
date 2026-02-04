import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

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
    <OdsMessage
      isDismissible={isDismissible}
      className={`block ${className}`}
      color={ODS_MESSAGE_COLOR.critical}
    >
      <span
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: errorMessage,
        }}
      />
    </OdsMessage>
  );
};
