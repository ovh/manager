import { Trans, useTranslation } from 'react-i18next';

import { ErrorMessageProps } from '@/components/error/ErrorMessage.prop';
import { getErrorValues } from '@/utils/error.utils';

export function ErrorMessage({ error }: ErrorMessageProps) {
  const { t } = useTranslation('shared');
  const { message, ovhQueryId } = getErrorValues(error);
  const queryId = ovhQueryId ? `x-ovh-query-id=${ovhQueryId}` : '';
  return (
    <Trans
      t={t}
      i18nKey="shared:error.message"
      values={{
        message,
        queryId,
      }}
      components={{
        br: <br />,
      }}
    />
  );
}

export default ErrorMessage;
