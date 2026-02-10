import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { RedirectionGuard, useNotifications } from '@ovh-ux/manager-react-components';

import { THealthMonitorFormState } from '@/api/data/health-monitor';
import { useCreateHealthMonitor, useGetHealthMonitor } from '@/api/hook/useHealthMonitor';
import { useGetPool } from '@/api/hook/usePool';
import HealthMonitorForm from '@/components/form/HealthMonitorForm.component';

export default function HealthMonitorCreatePage() {
  const { t } = useTranslation('health-monitor/create');

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

  const { data: healthMonitor, isPending: isHealthMonitorPending } = useGetHealthMonitor({
    projectId,
    region,
    poolId,
  });

  const { createHealthMonitor, isPending: isCreationPending } = useCreateHealthMonitor({
    projectId,
    region,
    poolId,
    onError(error: ApiError) {
      const requestId = (error?.config?.headers as Record<string, string> | undefined)?.[
        'X-OVH-MANAGER-REQUEST-ID'
      ];
      addError(
        <Trans
          i18nKey="octavia_load_balancer_global_error"
          ns="load-balancer"
          values={{
            message: error?.response?.data?.message || error?.message || null,
            requestId,
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
          ns="health-monitor/create"
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
        onCancel={() => navigate('../general-information')}
        onChange={setFormState}
        onSubmit={createHealthMonitor}
        submitLabel={t('octavia_load_balancer_health_monitor_create_submit_label')}
      />
    </RedirectionGuard>
  );
}
