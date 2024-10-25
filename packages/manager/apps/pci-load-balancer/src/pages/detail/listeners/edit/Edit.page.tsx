import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useEffect, useState } from 'react';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TProtocol } from '@/api/data/load-balancer';
import { useEditLoadBalancer, useListener } from '@/api/hook/useListener';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';
import ListenerForm, {
  TListenerFormState,
} from '@/components/form/ListenerForm.page';

export default function EditListener() {
  const navigate = useNavigate();
  const { projectId, region, loadBalancerId, listenerId } = useParams();
  const { addSuccess, addError } = useNotifications();

  const [formState, setFormState] = useState<TListenerFormState>({
    name: '',
    protocol: '' as TProtocol,
    port: 1,
    pool: null,
  });

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
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: ((error.response as unknown) as {
                    data: { message: string };
                  }).data.message,
                  requestId: ((error.response as unknown) as {
                    headers: Record<string, unknown>;
                  }).headers['x-ovh-queryid'],
                }),
              }}
            />
          )}
        </Translation>,
        true,
      );
      navigate('..');
    },
    onSuccess() {
      addSuccess(
        <Translation ns="listeners">
          {(_t) =>
            _t('octavia_load_balancer_listeners_edit_success', {
              listener: formState?.name,
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  useEffect(() => {
    if (listener && pools?.length) {
      setFormState({
        name: listener.name,
        protocol: listener.protocol,
        port: listener.port,
        pool: pools.find((pool) => pool.id === listener.defaultPoolId) ?? null,
      });
    }
  }, [listener, pools]);

  return (
    <ListenerForm
      formState={formState}
      onChange={setFormState}
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
