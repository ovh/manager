import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDeletePool } from '@/api/hook/usePool';

export default function DeletePoolPage() {
  const { t } = useTranslation('pools/delete');

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { projectId, region, loadBalancerId } = useParams();
  const [searchParams] = useSearchParams();

  const poolId = searchParams.get('poolId');
  const poolName = searchParams.get('poolName');

  const poolsListUrl = `/pci/projects/${projectId}/octavia-load-balancer/${region}/${loadBalancerId}/pools`;

  const onClose = () => {
    navigate('..');
  };

  const { deletePool, isPending } = useDeletePool({
    projectId,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="load-balancer">
          {(_t) =>
            _t('octavia_load_balancer_global_error', {
              message: error?.response?.data?.message || error?.message || null,
              requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="pools/delete">
          {(_t) =>
            _t('octavia_load_balancer_pools_components_delete_success', {
              pool: poolName,
            })
          }
        </Translation>,
        true,
      );
      navigate(poolsListUrl);
    },
  });

  const onCancel = () => {
    navigate('..');
  };

  return (
    <DeletionModal
      title={t('octavia_load_balancer_pools_components_delete_title')}
      onConfirm={() => deletePool(poolId)}
      onClose={onClose}
      onCancel={onCancel}
      isPending={isPending}
      type="warning"
      submitText={t('octavia_load_balancer_pools_components_delete_confirm')}
      cancelText={t('octavia_load_balancer_pools_components_delete_cancel')}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t('octavia_load_balancer_pools_components_delete_description', {
          pool: poolName,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
