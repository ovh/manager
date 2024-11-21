import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useContext } from 'react';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetApiSchema } from '@ovh-ux/manager-pci-common';
import { useCreatePool } from '@/api/hook/usePool';
import {
  PoolFormComponent,
  TPoolFormData,
} from '@/components/form/PoolForm.component';
import { TLoadBalancerPool } from '@/api/data/pool';

const TRACKING_HIT_PREFIX = 'add';

export default function PoolsCreatePage() {
  const { tracking } = useContext(ShellContext).shell;

  const { addSuccess, addError } = useNotifications();

  const { projectId, region, loadBalancerId } = useParams();

  const navigate = useNavigate();

  const goBack = () => navigate('../list');

  const { data: schema, isPending: isSpecsPending } = useGetApiSchema();

  const { doCreatePool, isPending: isCreating } = useCreatePool({
    projectId,
    region,
    loadbalancerId: loadBalancerId,
    onSuccess: (updatedPool: TLoadBalancerPool) => {
      tracking.trackClick({
        name: `${TRACKING_HIT_PREFIX}-success`,
        type: 'action',
      });
      goBack();

      addSuccess(
        <Translation ns="pools">
          {(_t) =>
            _t('octavia_load_balancer_pools_create_success', {
              pool: updatedPool.name,
            })
          }
        </Translation>,
        false,
      );
    },
    onError: (cause: ApiError) => {
      tracking.trackClick({
        name: `${TRACKING_HIT_PREFIX}-error`,
        type: 'action',
      });

      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: (cause?.response?.data as { message: string })
                    ?.message,
                  requestId: cause.response?.headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
    },
  });

  const create = ({
    name,
    algorithm,
    protocol,
    permanentSession,
  }: TPoolFormData) => {
    tracking.trackClick({
      name: `${TRACKING_HIT_PREFIX}::confirm`,
      type: 'action',
    });
    doCreatePool({ name, algorithm, protocol, permanentSession });
  };

  const cancel = () => {
    tracking.trackClick({
      name: `${TRACKING_HIT_PREFIX}::cancel`,
      type: 'action',
    });
    goBack();
  };

  if (isSpecsPending || isCreating)
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="center" />;

  return (
    <PoolFormComponent
      availableAlgorithms={
        schema?.models?.['cloud.loadbalancing.PoolAlgorithmEnum']?.enum || []
      }
      availableProtocols={
        schema?.models?.['cloud.loadbalancing.PoolProtocolEnum']?.enum || []
      }
      availableSessionTypes={(
        schema?.models?.['cloud.loadbalancing.PoolSessionPersistenceTypeEnum']
          ?.enum || []
      ).filter((sessionType) => sessionType !== 'disabled')}
      onSubmit={create}
      onCancel={cancel}
    />
  );
}
