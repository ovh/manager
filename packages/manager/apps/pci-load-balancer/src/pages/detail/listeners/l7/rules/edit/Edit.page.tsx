import { useNavigate, useParams } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import RuleForm from '@/components/form/RuleForm.component';
import { useGetL7Rule, useUpdateL7Rule } from '@/api/hook/useL7Rule';

export default function UpdatePage() {
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { projectId, policyId, region, ruleId } = useParams();
  const { updateL7Rule, isPending: isPendingUpdate } = useUpdateL7Rule({
    projectId,
    policyId,
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
    },
    onSuccess() {
      addSuccess(
        <Translation ns="l7/rules/edit">
          {(_t) => _t('octavia_load_balancer_edit_l7_rule_success')}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  const { data: rule, isPending: isPendingGetRule } = useGetL7Rule(
    projectId,
    policyId,
    region,
    ruleId,
  );
  const isPending = isPendingGetRule || isPendingUpdate;
  return (
    <>
      {isPending ? (
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      ) : (
        <RuleForm
          rule={rule}
          onCancel={() => navigate('..')}
          onSubmit={updateL7Rule}
        />
      )}
    </>
  );
}
