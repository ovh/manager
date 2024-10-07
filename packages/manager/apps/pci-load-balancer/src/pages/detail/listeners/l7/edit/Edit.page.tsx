import { Headers, useNotifications } from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useGetPolicy, useUpdatePolicy } from '@/api/hook/useL7Policy';
import PolicyForm from '@/components/detail/listeners/l7/PolicyForm.component';
import { useListener } from '@/api/hook/useListener';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';

export default function EditPage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('octavia-load-balancer-l7-edit');
  const {
    listenerId,
    projectId,
    region,
    loadBalancerId,
    policyId,
  } = useParams();
  const navigate = useNavigate();
  const { data: policy, isPending: isPendingPolicy } = useGetPolicy(
    projectId,
    policyId,
    region,
  );
  const { data: listener, isPending: isPendingListener } = useListener({
    projectId,
    region,
    loadBalancerId,
    listenerId,
  });

  const { data: pools, isPending: isPendingPools } = useAllLoadBalancerPools({
    projectId,
    region,
    loadBalancerId,
  });

  const { updatePolicy, isPending: isPendingCreate } = useUpdatePolicy({
    projectId,
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
    onSuccess(updatedPolicy) {
      addSuccess(
        <Translation ns="octavia-load-balancer-l7">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_edit_l7_policy_success', {
                  policy: updatedPolicy?.name,
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  const isPending =
    isPendingListener || isPendingPools || isPendingCreate || isPendingPolicy;
  return (
    <div>
      <div className=" mt-8">
        <Headers
          description={t('octavia_load_balancer_edit_l7_policy_description')}
          title={t('octavia_load_balancer_edit_l7_policy_title')}
        />
      </div>
      {isPending ? (
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      ) : (
        <PolicyForm
          policy={policy}
          listener={listener}
          pools={pools}
          onCancel={() => navigate('..')}
          onSubmit={updatePolicy}
        />
      )}
    </div>
  );
}
