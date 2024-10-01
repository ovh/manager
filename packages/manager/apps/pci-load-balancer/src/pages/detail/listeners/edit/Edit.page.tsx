import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ListenerForm from '@/components/detail/listeners/ListenerForm.page';
import { useEditLoadBalancer } from '@/api/hook/useLoadBalancer';
import { useListener } from '@/api/hook/useListener';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';

export default function EditListener() {
  const navigate = useNavigate();
  const { projectId, region, loadBalancerId, listenerId } = useParams();
  const { addSuccess, addError } = useNotifications();

  const { data: pools } = useAllLoadBalancerPools({
    projectId,
    region,
    loadBalancerId,
  });

  const { data: listener, isPending: isListenerPending } = useListener({
    projectId,
    region,
    loadBalancerId,
    listenerId,
  });

  const { editListener, isPending: isEditionPending } = useEditLoadBalancer({
    projectId,
    region,
    listenerId,
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
            _t('octavia_load_balancer_listeners_edit_success', {
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
      listener={listener}
      isEditing
      pools={pools}
      isPending={isEditionPending || isListenerPending}
      onCancel={() => navigate('..')}
      onSubmit={(state) =>
        editListener({
          name: state.name !== listener.name ? state.name : undefined,
          defaultPoolId:
            state.pool?.id !== listener.defaultPoolId
              ? state.pool?.id
              : undefined,
        })
      }
    />
  );
}
