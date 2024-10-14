import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import RuleForm from '@/components/detail/listeners/l7/rules/RuleForm.component';
import { useCreateRule } from '@/api/hook/useL7Rule';

export default function CreatePage() {
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation('l7/rules/create');
  const { projectId, policyId, region } = useParams();
  const { createRule, isPending: isPendingCreate } = useCreateRule({
    projectId,
    policyId,
    region,
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
    },
    onSuccess() {
      addSuccess(
        <Translation ns="l7/rules/list">
          {(_t) => _t('octavia_load_balancer_create_l7_rule_success')}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  return (
    <>
      {isPendingCreate ? (
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      ) : (
        <RuleForm
          rule={null}
          onCancel={() => navigate('..')}
          onSubmit={createRule}
          submitButtonText={t(
            'octavia_load_balancer_create_l7_rule_submit_creation',
          )}
        />
      )}
    </>
  );
}
