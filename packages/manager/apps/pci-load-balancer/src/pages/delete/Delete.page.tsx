import { Translation, useTranslation } from 'react-i18next';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useDeleteLoadBalancer,
  useLoadBalancer,
} from '@/api/hook/useLoadBalancer';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t: tDelete } = useTranslation('delete');
  const navigate = useNavigate();
  const { projectId, loadBalancerId, region } = useParams();
  const onClose = () => {
    navigate('..');
  };
  const {
    data: loadBalancer,
    isPending: isPendingLoadBalancer,
  } = useLoadBalancer({
    projectId,
    region,
    loadBalancerId,
  });

  const {
    deleteLoadBalancer,
    isPending: isPendingDelete,
  } = useDeleteLoadBalancer({
    projectId,
    loadBalancer,
    onError(error: ApiError) {
      addError(
        <Translation ns="common">
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
        <Translation ns="common">
          {(_t) => _t('octavia_load_balancer_delete_success')}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    deleteLoadBalancer();
  };

  const onCancel = () => {
    navigate('..');
  };

  const isPending = isPendingLoadBalancer || isPendingDelete;

  return (
    <DeletionModal
      title={tDelete('octavia_load_balancer_delete_title')}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={isPending}
      type="warning"
      submitText={tDelete('octavia_load_balancer_delete_confirm')}
      cancelText={tDelete('octavia_load_balancer_delete_cancel')}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {tDelete('octavia_load_balancer_delete_description', {
          loadbalancer: loadBalancer?.name,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
