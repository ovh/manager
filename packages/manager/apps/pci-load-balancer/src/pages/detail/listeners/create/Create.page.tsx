import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useState } from 'react';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ListenerForm, {
  TListenerFormState,
} from '@/components/form/ListenerForm.component';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';
import { TProtocol } from '@/api/data/load-balancer';
import { useCreateListener } from '@/api/hook/useListener';

export default function CreateListener() {
  const navigate = useNavigate();
  const { projectId, region, loadBalancerId } = useParams();
  const { addSuccess, addError } = useNotifications();

  const [formState, setFormState] = useState<TListenerFormState>({
    name: '',
    protocol: '' as TProtocol,
    port: 0,
    pool: null,
  });

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
            _t('octavia_load_balancer_listeners_create_success', {
              listener: formState?.name,
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
      formState={formState}
      onChange={setFormState}
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
