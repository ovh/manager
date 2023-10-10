import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  error: ErrorObject;
}

interface ErrorObject {
  [key: string]: any;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  const { t } = useTranslation('catalog-revamp/error');
  return (
    <div>
      {t('manager_error_page_default')} <br />
      {error?.data?.message && <strong>{error.data.message}</strong>}
      {error?.headers['x-ovh-queryid'] && (
        <p>
          {t('manager_error_page_detail_code')}
          {error.headers['x-ovh-queryid']}
        </p>
      )}
    </div>
  );
};

export default ErrorMessage;
