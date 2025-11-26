import { ReactElement, useMemo, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsModal, OsdsSpinner } from '@ovhcloud/ods-components/react';

import { isApiCustomError } from '@ovh-ux/manager-core-api';
import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useClusterNodePools, useUpdateNodePoolSize } from '@/api/hooks/node-pools';
import { Autoscaling } from '@/components/Autoscaling.component';
import { NODE_RANGE } from '@/constants';
import { isScalingValid } from '@/helpers/node-pool';
import { useTrack } from '@/hooks/track';
import { queryClient } from '@/queryClient';
import { TScalingState } from '@/types';

export default function ScalePage(): ReactElement {
  const { projectId, kubeId: clusterId } = useSafeParams('projectId', 'kubeId');
  const [searchParams] = useSearchParams();
  const poolId = searchParams.get('nodePoolId') as string;

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addError, addSuccess } = useNotifications();

  const { t: tScale } = useTranslation('scale');
  const { t: tListing } = useTranslation('listing');

  const { trackClick } = useTrack();

  const { data: pool, isPending: isPoolsPending } = useClusterNodePools(
    projectId,
    clusterId,
    (pools) => {
      const pool = pools?.find((p) => p.id === poolId);
      return pool
        ? {
            scalingState: {
              quantity: {
                desired: pool.desiredNodes,
                min: pool.minNodes,
                max: pool.maxNodes,
              },
              antiAffinity: pool.antiAffinity,
              monthlyBilled: pool.monthlyBilled,
              isAutoscale: pool.autoscale,
            } as TScalingState,
            original: pool,
          }
        : null;
    },
  );

  const [state, setState] = useState<TScalingState | null>(pool?.scalingState ?? null);

  const { updateSize, isPending: isPendingScaling } = useUpdateNodePoolSize({
    onError(cause: Error) {
      if (isApiCustomError(cause)) {
        addError(
          tScale('kube_node_pool_autoscaling_scale_error', {
            message: cause.response?.data.message,
          }),
          true,
        );
      }
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

  const isDisabled = isPendingScaling || (state && !isScalingValid(state));

  const scaleObject = useMemo(() => {
    const { desired, min, max } = state?.quantity || {};
    const d = Number(desired),
      mn = Number(min),
      mx = Number(max);

    if (state?.isAutoscale) {
      return { maxNodes: mx || NODE_RANGE.MAX, minNodes: mn || 0 };
    }

    if (d < mn) return { minNodes: d };
    if (d > mx) return { maxNodes: d };
    return {};
  }, [state?.quantity, state?.isAutoscale]);

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
            initialScaling={state?.quantity}
            isMonthlyBilling={pool?.original.monthlyBilled}
            isAntiAffinity={pool?.original.antiAffinity}
            isAutoscale={!!state?.isAutoscale}
            onChange={setState}
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
