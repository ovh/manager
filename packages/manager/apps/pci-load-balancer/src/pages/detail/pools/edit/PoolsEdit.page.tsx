import { useNavigate, useParams } from 'react-router-dom';
import { useGetApiSchema } from '@ovh-ux/manager-pci-common';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Translation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useGetPool, useUpdatePool } from '@/api/hook/usePool';
import {
  PoolFormComponent,
  TPoolFormData,
} from '@/components/form/PoolForm.component';
import { TLoadBalancerPool } from '@/api/data/pool';

const TRACKING_HIT_PREFIX = 'edit';

export default function PoolsEditPage(): JSX.Element {
  const { trackClick } = useOvhTracking();

  const { addSuccess, addError } = useNotifications();

  const { projectId, region, poolId } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('../list');

  const { data: pool, isPending: isPoolPending } = useGetPool({
    projectId,
    region,
    poolId,
  });

  const { data: schema, isPending: isSpecsPending } = useGetApiSchema();

  const { doUpdatePool, isPending: isUpdating } = useUpdatePool({
    projectId,
    region,
    poolId,
    onSuccess: (updatedPool: TLoadBalancerPool) => {
      trackClick({
        actions: [`${TRACKING_HIT_PREFIX}`, `success`],
        actionType: 'action',
      });
      goBack();

      addSuccess(
        <Translation ns="pools">
          {(_t) =>
            _t('octavia_load_balancer_pools_edit_success', {
              pool: updatedPool.name,
            })
          }
        </Translation>,
        false,
      );
    },
    onError: (cause: ApiError) => {
      trackClick({
        actions: [`${TRACKING_HIT_PREFIX}`, `error`],
        actionType: 'action',
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

  const cancel = () => {
    trackClick({
      actions: [`${TRACKING_HIT_PREFIX}`, `cancel`],
      actionType: 'action',
    });
    navigate(`../${poolId}`);
  };

  const edit = ({ name, algorithm, permanentSession }: TPoolFormData) => {
    trackClick({
      actions: [`${TRACKING_HIT_PREFIX}`, `confirm`],
      actionType: 'action',
    });
    doUpdatePool({ name, algorithm, permanentSession });
  };

  if (isSpecsPending || isPoolPending || isUpdating)
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
      name={pool.name}
      algorithm={pool.algorithm}
      protocol={pool.protocol}
      permanentSession={{
        isEnabled: pool.sessionPersistence.type !== 'disabled',
        cookieName: pool.sessionPersistence.cookieName,
        type: pool.sessionPersistence.type,
      }}
      onSubmit={edit}
      onCancel={cancel}
      isEditMode
    />
  );
}
