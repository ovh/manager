import { ReactElement, useEffect, useMemo, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsModal, OsdsSpinner } from '@ovhcloud/ods-components/react';

import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useClusterNodePools, useUpdateNodePoolSize } from '@/api/hooks/node-pools';
import { Autoscaling } from '@/components/Autoscaling.component';
import { NODE_RANGE } from '@/constants';
import { isScalingValid } from '@/helpers/node-pool';
import { useTrack } from '@/hooks/track';
import queryClient from '@/queryClient';
import { TScalingState } from '@/types';

export default function ScalePage(): ReactElement {
  const { projectId, kubeId: clusterId } = useSafeParams('projectId', 'kubeId');
  const [searchParams] = useSearchParams();
  const poolId = searchParams.get('nodePoolId');

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addError, addSuccess } = useNotifications();

  const { t: tScale } = useTranslation('scale');
  const { t: tListing } = useTranslation('listing');

  const { trackClick } = useTrack();

  const [state, setState] = useState<TScalingState | null>(null);

  const { data: pools, isPending: isPoolsPending } = useClusterNodePools(projectId, clusterId);

  const pool = useMemo(() => pools?.find((p) => p.id === poolId), [pools, poolId]);

  useEffect(() => {
    if (pool) {
      setState({
        quantity: {
          desired: pool.desiredNodes,
          min: pool.minNodes,
          max: pool.maxNodes,
        },
        isAutoscale: pool.autoscale,
      });
    }
  }, [pool]);

  const { updateSize, isPending: isPendingScaling } = useUpdateNodePoolSize({
    onError(cause: Error & { response: { data: { message: string } } }): void {
      addError(
        tScale('kube_node_pool_autoscaling_scale_error', {
          message: cause?.response?.data?.message,
        }),
        true,
      );
      goBack();
    },
    onSuccess: async () => {
      trackClick(`details::nodepools::scale::confirm`);
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'kubernetes', clusterId, 'nodePools'],
      });
      addSuccess(tScale('kube_node_pool_autoscaling_scale_success'), true);
      goBack();
    },
    projectId,
    clusterId,
    poolId,
  });

  const isDisabled = isPendingScaling || (state && !isScalingValid({ scaling: state }));

  const scaleObject = useMemo(() => {
    const desired = Number(state?.quantity.desired);
    const minNodes = Number(pool?.minNodes);
    const maxNodes = Number(pool?.maxNodes);

    if (state?.isAutoscale) {
      return {
        maxNodes: state?.quantity.max || NODE_RANGE.MAX,
        minNodes: state?.quantity.min || 0,
      };
    }

    if (desired < minNodes) {
      return {
        minNodes: desired,
      };
    }
    if (desired > maxNodes) {
      return {
        maxNodes: desired,
      };
    }
    return {};
  }, [state?.quantity, pool, state?.isAutoscale]);

  return (
    <OsdsModal
      headline={tListing('kube_common_node_pool_autoscaling_title')}
      onOdsModalClose={() => {
        trackClick(`details::nodepools::scale::cancel`);
        goBack();
      }}
    >
      <slot name="content">
        {!isPoolsPending && !isPendingScaling ? (
          <Autoscaling
            initialScaling={{
              min: pool?.minNodes ?? 0,
              max: pool?.maxNodes ?? NODE_RANGE.MAX,
              desired: pool?.desiredNodes ?? NODE_RANGE.MIN,
            }}
            isMonthlyBilling={pool?.monthlyBilled}
            isAntiAffinity={pool?.antiAffinity}
            autoscale={pool?.autoscale}
            onChange={(s) => setState(s)}
          />
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="block text-center" />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          goBack();
        }}
      >
        {tListing('kube_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          updateSize({
            autoscale: state?.isAutoscale ?? false,
            desiredNodes: state?.quantity.desired ?? NODE_RANGE.MIN,
            ...scaleObject,
          });
        }}
        {...(isDisabled ? { disabled: true } : {})}
      >
        {tListing('kube_common_save')}
      </OsdsButton>
    </OsdsModal>
  );
}
