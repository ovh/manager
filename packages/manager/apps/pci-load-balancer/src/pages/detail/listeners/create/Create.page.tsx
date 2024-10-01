import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateListener } from '@/api/hook/useLoadBalancer';
import ListenerForm from '@/components/detail/listeners/ListenerForm.page';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';

export default function CreateListener() {
  const navigate = useNavigate();
  const { projectId, region, loadBalancerId } = useParams();
  const { addSuccess, addError } = useNotifications();

  const { data: pools } = useAllLoadBalancerPools({
    projectId,
    region,
    loadBalancerId,
  });

  const { createListener, isPending: isCreationPending } = useCreateListener({
    projectId,
    region,
    loadBalancerId,
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
    onSuccess() {
      addSuccess(
        <Translation ns="octavia-load-balancer-listeners">
          {(_t) =>
            _t('octavia_load_balancer_listeners_create_success', {
              listener: '??',
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  return (
    <ListenerForm
      pools={pools}
      isPending={isCreationPending}
      onCancel={() => navigate('..')}
      onSubmit={(state) =>
        createListener({
          name: state.name,
          port: state.port,
          protocol: state.protocol,
          defaultPoolId: state.pool?.id,
        })
      }
    />
  );
}
