import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications as useMRCNotifications } from '@ovh-ux/manager-react-components';
import { useCallback } from 'react';
import { Trans, Translation } from 'react-i18next';

export const useNotifications = ({ ns }: { ns: string }) => {
  const { addSuccess, addError } = useMRCNotifications();

  const addErrorMessage = useCallback(
    ({
      i18nKey,
      error,
      values,
    }: {
      i18nKey: string;
      error?: ApiError;
      values?: Record<string, string>;
    }) =>
      addError(
        <Translation ns={ns}>
          {(t) => (
            <Trans
              t={t}
              i18nKey={i18nKey}
              values={{
                ...values,
                message:
                  error?.response?.data?.message || error?.message || null,
              }}
            />
          )}
        </Translation>,
        true,
      ),
    [addError, ns],
  );

  const addSuccessMessage = useCallback(
    ({
      i18nKey,
      values,
    }: {
      i18nKey: string;
      values?: Record<string, string>;
    }) =>
      addSuccess(
        <Translation ns={ns}>
          {(t) => (
            <Trans
              t={t}
              i18nKey={i18nKey}
              values={{
                ...values,
              }}
            />
          )}
        </Translation>,
        true,
      ),
    [addSuccess, ns],
  );

  return { addSuccessMessage, addErrorMessage };
};
