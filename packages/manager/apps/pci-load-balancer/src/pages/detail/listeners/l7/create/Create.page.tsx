import {
  Headers,
  Notifications,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import PolicyForm from '@/components/form/PolicyForm.component';
import { useCreatePolicy } from '@/api/hook/useL7Policy';
import { useListener } from '@/api/hook/useListener';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';

export default function CreatePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('l7/create');
  const projectUrl = useProjectUrl('public-cloud');
  const { listenerId, projectId, region, loadBalancerId } = useParams();
  const navigate = useNavigate();

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

  const { createPolicy, isPending: isPendingCreate } = useCreatePolicy({
    projectId,
    listenerId,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message:
                    error?.response?.data?.message || error?.message || null,
                  requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
    },
    onSuccess(newPolicy) {
      const l7RulesCreationLink = `${projectUrl}/octavia-load-balancer/${region}/${loadBalancerId}/listeners/${listenerId}/l7/${newPolicy?.id}/rules/create`;
      addSuccess(
        <Translation ns="l7">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_create_l7_policy_success', {
                  policy: newPolicy?.name,
                  link: l7RulesCreationLink,
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
  const isPending = isPendingListener || isPendingPools || isPendingCreate;
  return (
    <div>
      <div className=" mt-8">
        <Headers
          description={t('octavia_load_balancer_create_l7_policy_description')}
          title={t('octavia_load_balancer_create_l7_policy_title')}
        />
      </div>
      <Notifications />
      {isPending ? (
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      ) : (
        <PolicyForm
          policy={null}
          onCancel={() => navigate('..')}
          onSubmit={createPolicy}
          listener={listener}
          pools={pools}
          submitButtonText={t(
            'octavia_load_balancer_create_l7_policy_create_submit',
          )}
        />
      )}
    </div>
  );
}
