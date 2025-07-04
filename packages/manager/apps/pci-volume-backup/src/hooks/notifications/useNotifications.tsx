import { isApiCustomError } from '@ovh-ux/manager-core-api';
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
      error?: Error;
      values?: Record<string, string | undefined>;
    }) => {
      let errorMessage: string | null = null;
      if (isApiCustomError(error) && error.response)
        errorMessage = error.response.data.message;
      else if (error) errorMessage = error.message;

      return addError(
        <div>
          <Translation ns={ns}>
            {(t) => (
              <Trans
                t={t}
                i18nKey={i18nKey}
                values={{
                  ...values,
                  message: errorMessage,
                  errorMessage,
                }}
              />
            )}
          </Translation>
        </div>,
        true,
      );
    },
    [addError, ns],
  );

  const addSuccessMessage = useCallback(
    ({
      i18nKey,
      values,
    }: {
      i18nKey: string;
      values?: Record<string, string | undefined>;
    }) =>
      addSuccess(
        <div>
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
          </Translation>
        </div>,
        true,
      ),
    [addSuccess, ns],
  );

  return { addSuccessMessage, addErrorMessage };
};
