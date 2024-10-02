import {
  Headers,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import PolicyForm from '@/components/detail/listeners/l7/PolicyForm.component';
import { TL7Policy } from '@/api/data/l7Policies';
import { useCreatePolicy } from '@/api/hook/useL7Policy';

export default function CreatePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('octavia-load-balancer-l7-create');
  const projectUrl = useProjectUrl('public-cloud');
  const { listenerId, projectId, region, loadBalancerId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<TL7Policy>({
    listenerId,
    position: 1,
    redirectHttpCode: undefined,
    redirectPoolId: undefined,
    redirectPrefix: undefined,
    redirectUrl: undefined,
    name: '',
    action: '',
  } as TL7Policy);

  const { createPolicy, isPending } = useCreatePolicy({
    projectId,
    listenerId,
    region,
    policy,
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
      navigate('..');
    },
    onSuccess(newPolicy) {
      const l7RulesCreationLink = `${projectUrl}/octavia-load-balancer/${region}/${loadBalancerId}/listeners/${listenerId}/l7/${newPolicy?.id}/rules/create`;
      addSuccess(
        <Translation ns="octavia-load-balancer-l7">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_create_l7_policy_success', {
                  policy: policy?.name,
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
  return (
    <div>
      <div className=" mt-8">
        <Headers
          description={t('octavia_load_balancer_create_l7_policy_description')}
          title={t('octavia_load_balancer_create_l7_policy_title')}
        />
      </div>
      <PolicyForm
        policy={policy}
        onCancel={() => navigate('..')}
        onSubmit={createPolicy}
        isPendingAction={isPending}
        onChange={(policyUpdated) => setPolicy(() => policyUpdated)}
      />
    </div>
  );
}
