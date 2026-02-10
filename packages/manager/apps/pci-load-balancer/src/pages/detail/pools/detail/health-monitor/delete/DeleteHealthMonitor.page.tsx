import { useNavigate, useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useDeleteHealthMonitor, useGetHealthMonitor } from '@/api/hook/useHealthMonitor';
import { useGetPool } from '@/api/hook/usePool';

export default function DeleteHealthMonitorPage() {
  const { t } = useTranslation('health-monitor/delete');

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { projectId, region, poolId } = useParams();

  const { data: pool, isPending: isGetPoolPending } = useGetPool({
    projectId,
    region,
    poolId,
  });

  const { data: healthMonitor, isPending: isGetHealthMonitorPending } = useGetHealthMonitor({
    projectId,
    region,
    poolId,
  });

  const { deleteHealthMonitor, isPending: isDeletePending } = useDeleteHealthMonitor({
    projectId,
    region,
    onError(error: ApiError) {
      const requestId = (error?.config?.headers as Record<string, string> | undefined)?.[
        'X-OVH-MANAGER-REQUEST-ID'
      ];
      navigate('..');
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
    },
    onSuccess() {
      navigate('../..');
      addSuccess(
        <Trans
          i18nKey="octavia_load_balancer_health_monitor_detail_overview_delete_success"
          ns="health-monitor/delete"
          values={{ healthMonitor: healthMonitor?.name, pool: pool?.name }}
        />,
        true,
      );
    },
  });

  return (
    <DeletionModal
      title={t('octavia_load_balancer_health_monitor_detail_overview_delete_title')}
      onConfirm={() => deleteHealthMonitor(healthMonitor?.id)}
      onClose={() => navigate('..')}
      onCancel={() => navigate('..')}
      isPending={isGetPoolPending || isGetHealthMonitorPending || isDeletePending}
      type="warning"
      submitText={t('octavia_load_balancer_health_monitor_detail_overview_delete_confirm')}
      cancelText={t('octavia_load_balancer_health_monitor_detail_overview_delete_cancel')}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        <Trans
          i18nKey="octavia_load_balancer_health_monitor_detail_overview_delete_description"
          ns="health-monitor/delete"
          values={{ healthMonitor: healthMonitor?.name, pool: pool?.name }}
        />
      </OsdsText>
    </DeletionModal>
  );
}
