import { Translation, useTranslation } from 'react-i18next';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeleteL7Rule } from '@/api/hook/useL7Rule';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t: tDelete } = useTranslation('l7/rules/delete');
  const navigate = useNavigate();
  const { projectId, policyId, region, ruleId } = useParams();
  const onClose = () => {
    navigate('..');
  };
  const { deleteL7Rule, isPending: isPendingDelete } = useDeleteL7Rule({
    projectId,
    region,
    policyId,
    ruleId,
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
          {(_t) => _t('octavia_load_balancer_list_l7_policies_delete_success')}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    deleteL7Rule();
  };

  const onCancel = () => {
    navigate('..');
  };

  return (
    <DeletionModal
      title={tDelete('octavia_load_balancer_list_l7_rules_delete_title')}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={isPendingDelete}
      type="warning"
      submitText={tDelete('octavia_load_balancer_list_l7_rules_delete_confirm')}
      cancelText={tDelete('octavia_load_balancer_list_l7_rules_delete_cancel')}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {tDelete('octavia_load_balancer_list_l7_rules_delete_description')}
      </OsdsText>
    </DeletionModal>
  );
}
