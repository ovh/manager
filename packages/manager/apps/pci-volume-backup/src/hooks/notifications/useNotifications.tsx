import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications as useMRCNotifications } from '@ovh-ux/manager-react-components';
import { useCallback } from 'react';
import { Trans, Translation } from 'react-i18next';
import TrackedNotification, {
  TTrackedNotificationProps,
} from '@/components/TrackedNotification';

export const useNotifications = ({ ns }: { ns: string }) => {
  const { addSuccess, addError } = useMRCNotifications();

  const addErrorMessage = useCallback(
    ({
      i18nKey,
      error,
      values,
      trackingParams,
    }: {
      i18nKey: string;
      error?: ApiError;
      values?: Record<string, string | undefined>;
      trackingParams?: TTrackedNotificationProps['trackingParams'];
    }) => {
      const notification = (
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
        </Translation>
      );
      return addError(
        trackingParams ? (
          <TrackedNotification
            notification={notification}
            trackingParams={trackingParams}
          />
        ) : (
          <div>{notification}</div>
        ),
        true,
      );
    },
    [addError, ns],
  );

  const addSuccessMessage = useCallback(
    ({
      i18nKey,
      values,
      trackingParams,
    }: {
      i18nKey: string;
      values?: Record<string, string | undefined>;
      trackingParams?: TTrackedNotificationProps['trackingParams'];
    }) => {
      const notification = (
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
      );
      return addSuccess(
        trackingParams ? (
          <TrackedNotification
            notification={notification}
            trackingParams={trackingParams}
          />
        ) : (
          <div>{notification}</div>
        ),
        true,
      );
    },
    [addSuccess, ns],
  );

  return { addSuccessMessage, addErrorMessage };
};
