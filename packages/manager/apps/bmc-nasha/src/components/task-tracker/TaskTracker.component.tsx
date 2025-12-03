import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useTask } from '@ovh-ux/manager-module-common-api';
import { Message } from '@ovh-ux/muk';

type TaskTrackerProps = {
  taskApiUrl: string;
  taskId: number | string;
  operation: string;
  params?: Record<string, string | number>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  goBack?: (options?: { success?: string; error?: string; reload?: boolean }) => void;
  trackingData?: {
    prefix: string;
    hit: string;
  };
};

export default function TaskTracker({
  taskApiUrl,
  taskId,
  operation,
  params = {},
  onSuccess,
  onError,
  goBack,
  trackingData,
}: TaskTrackerProps) {
  const { t } = useTranslation(['common', 'task-tracker']);
  const navigate = useNavigate();

  // Extract resource URL from taskApiUrl (e.g., "/dedicated/nasha/{serviceName}/task" -> "dedicated/nasha/{serviceName}")
  const resourceUrl = taskApiUrl.replace('/task', '').replace(/^\//, '');

  const { isPending, isSuccess, isError, error } = useTask({
    resourceUrl,
    taskId,
    apiVersion: 'v2',
    refetchIntervalTime: 2000,
    onSuccess: () => {
      const successMessage = t(`task-tracker:operation_${operation}_success`, params);
      onSuccess?.();
      if (goBack) {
        goBack({ success: successMessage, reload: true });
      } else {
        void navigate(-1);
      }
    },
    onError: () => {
      const errorMessage = error?.message || t(`task-tracker:operation_${operation}_error`, params);
      onError?.(error as Error);
      if (goBack) {
        goBack({ error: errorMessage });
      }
    },
  });

  useEffect(() => {
    if (trackingData) {
      // Track completion if needed
    }
  }, [isSuccess, isError, trackingData]);

  return (
    <div className="task-tracker p-6">
      <div className="mb-4">
        <Message color="warning" title={t(`task-tracker:operation_${operation}`, params)}>
          {t('task-tracker:warning')}
        </Message>
      </div>

      {params && Object.keys(params).length > 0 && (
        <div className="mb-4">
          {Object.entries(params).map(
            ([key, value]) =>
              value && (
                <strong key={key} className="block">
                  {t(`task-tracker:param_${key}`, { [key]: value })}
                </strong>
              ),
          )}
        </div>
      )}

      {isPending && (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>{t('task-tracker:processing')}</span>
        </div>
      )}

      {isSuccess && (
        <Message color="success" title={t('task-tracker:success')}>
          {t(`task-tracker:operation_${operation}_success`, params)}
        </Message>
      )}

      {isError && (
        <Message color="critical" title={t('task-tracker:error')}>
          {error?.message || t(`task-tracker:operation_${operation}_error`, params)}
        </Message>
      )}
    </div>
  );
}
