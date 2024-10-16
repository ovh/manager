import { ApiError } from '@ovh-ux/manager-core-api';
import {
  RedirectionGuard,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import HealthMonitorForm from '@/components/form/HealthMonitorForm.page';
import { useGetPool } from '@/api/hook/usePool';
import {
  useCreateHealthMonitor,
  useGetHealthMonitor,
} from '@/api/hook/useHealthMonitor';
import { THealthMonitorFormState } from '@/api/data/health-monitor';

export default function HealthMonitorCreatePage() {
  const { t } = useTranslation('octavia-load-balancer-health-monitor-create');

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { projectId, region, poolId } = useParams();

  const [formState, setFormState] = useState<THealthMonitorFormState>({
    maxRetriesDown: 3,
    delay: 5,
    maxRetries: 4,
    timeout: 4,
  });

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

  const {
    createHealthMonitor,
    isPending: isCreationPending,
  } = useCreateHealthMonitor({
    projectId,
    region,
    poolId,
    onError(error: ApiError) {
      addError(
        <Trans
          i18nKey="octavia_load_balancer_global_error"
          ns="octavia-load-balancer"
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
          i18nKey="octavia_load_balancer_health_monitor_create_success"
          ns="octavia-load-balancer-health-monitor-create"
          values={{ name: healthMonitor?.name }}
        />,
        true,
      );
      navigate('../health-monitor');
    },
  });

  const isPending = isPoolPending || isHealthMonitorPending;

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && !!healthMonitor}
      route="../health-monitor"
    >
      <HealthMonitorForm
        title={t('octavia_load_balancer_health_monitor_create_title')}
        associatedPool={pool}
        formState={formState}
        isPending={isPoolPending || isCreationPending}
        onCancel={() => navigate('../health-monitor')}
        onChange={setFormState}
        onSubmit={createHealthMonitor}
        submitLabel={t(
          'octavia_load_balancer_health_monitor_create_submit_label',
        )}
      />
    </RedirectionGuard>
  );
}
