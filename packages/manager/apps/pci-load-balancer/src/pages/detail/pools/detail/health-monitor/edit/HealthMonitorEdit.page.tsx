import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HealthMonitorForm from '@/components/form/HealthMonitorForm.component';
import { useGetPool } from '@/api/hook/usePool';
import {
  useEditHealthMonitor,
  useGetHealthMonitor,
} from '@/api/hook/useHealthMonitor';
import { THealthMonitorFormState } from '@/api/data/health-monitor';
import { isTypeHttpOrHttps } from '@/helpers';

export default function HealthMonitorEditPage() {
  const { t } = useTranslation('health-monitor/edit');

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { projectId, region, poolId } = useParams();

  const [formState, setFormState] = useState<THealthMonitorFormState>(null);

  const { data: pool, isPending: isPoolPending } = useGetPool({
    projectId,
    region,
    poolId,
  });

  const {
    data: healthMonitor,
    isPending: isHealthMonitorPending,
  } = useGetHealthMonitor({
    projectId,
    region,
    poolId,
  });

  const { editHealthMonitor, isPending: isEditPending } = useEditHealthMonitor({
    projectId,
    region,
    healthMonitorId: healthMonitor?.id,
    onError(error: ApiError) {
      addError(
        <Trans
          i18nKey="octavia_load_balancer_global_error"
          ns="load-balancer"
          values={{
            message: error?.response?.data?.message || error?.message || null,
            requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          }}
        />,
        true,
      );
      navigate('../health-monitor');
    },
    onSuccess() {
      addSuccess(
        <Trans
          i18nKey="octavia_load_balancer_health_monitor_edit_success"
          ns="health-monitor/edit"
          values={{ name: healthMonitor?.name }}
        />,
        true,
      );
      navigate('../health-monitor');
    },
  });

  const isPending =
    isPoolPending || isHealthMonitorPending || isEditPending || !formState;

  useEffect(() => {
    if (healthMonitor) {
      setFormState({
        name: healthMonitor.name,
        type: healthMonitor.monitorType,
        maxRetriesDown: healthMonitor.maxRetriesDown,
        delay: healthMonitor.delay,
        maxRetries: healthMonitor.maxRetries,
        timeout: healthMonitor.timeout,
        ...(healthMonitor.httpConfiguration &&
        isTypeHttpOrHttps(healthMonitor.monitorType)
          ? {
              urlPath: healthMonitor.httpConfiguration.urlPath,
              expectedCode: healthMonitor.httpConfiguration.expectedCodes,
            }
          : {}),
      });
    }
  }, [healthMonitor]);

  return (
    <HealthMonitorForm
      title={t('octavia_load_balancer_health_monitor_edit_title')}
      associatedPool={pool}
      formState={formState}
      onChange={setFormState}
      isEditing
      isPending={isPending}
      onCancel={() => navigate('../health-monitor')}
      onSubmit={editHealthMonitor}
      submitLabel={t('octavia_load_balancer_health_monitor_edit_submit_label')}
    />
  );
}
