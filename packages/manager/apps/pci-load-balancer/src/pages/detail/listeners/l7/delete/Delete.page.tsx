import { Translation, useTranslation } from 'react-i18next';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeletePolicy, useGetPolicy } from '@/api/hook/useL7Policy';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t: tDelete } = useTranslation('octavia-load-balancer-l7-delete');
  const navigate = useNavigate();
  const { projectId, policyId, region } = useParams();
  const onClose = () => {
    navigate('..');
  };
  const { data: policy, isPending: isPendingPolicy } = useGetPolicy(
    projectId,
    policyId,
    region,
  );

  const { deletePolicy, isPending: isPendingDelete } = useDeletePolicy({
    projectId,
    region,
    policyId,
    onError(error: ApiError) {
      addError(
        <Translation ns="octavia-load-balancer">
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
        <Translation ns="octavia-load-balancer-l7">
          {(_t) =>
            _t('octavia_load_balancer_list_l7_policies_delete_success', {
              policy: policy?.name,
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    deletePolicy();
  };

  const onCancel = () => {
    navigate('..');
  };

  const isPending = isPendingPolicy || isPendingDelete;

  return (
    <DeletionModal
      title={tDelete('octavia_load_balancer_list_l7_policies_delete_title')}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={isPending}
      type="warning"
      submitText={tDelete(
        'octavia_load_balancer_list_l7_policies_delete_confirm',
      )}
      cancelText={tDelete(
        'octavia_load_balancer_list_l7_policies_delete_cancel',
      )}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {tDelete('octavia_load_balancer_list_l7_policies_delete_description', {
          policy: policy?.name,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
