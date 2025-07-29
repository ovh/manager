import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_NAMESPACES } from '@/utils';

export const useApiErrorMessage = (error?: ApiError) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.error);

  return error
    ? t('managerApiError', {
        error: error?.response?.data?.message,
        ovhQueryId: error?.response.headers?.['x-ovh-queryid'],
      })
    : undefined;
};

export type ApiErrorMessageProps = {
  error: ApiError;
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
