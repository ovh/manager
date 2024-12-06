import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  useClusterNodePools,
  useUpdateNodePoolSize,
} from '@/api/hooks/node-pools';
import queryClient from '@/queryClient';
import {
  Autoscaling,
  AutoscalingState,
} from '@/components/Autoscaling.component';
import { useTrack } from '@/hooks/track';

export default function ScalePage(): JSX.Element {
  const { projectId, kubeId: clusterId } = useParams();
  const [searchParams] = useSearchParams();
  const poolId = searchParams.get('nodePoolId');

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addError, addSuccess } = useNotifications();

  const { t: tScale } = useTranslation('scale');
  const { t: tListing } = useTranslation('listing');

  const { trackClick } = useTrack();

  const [state, setState] = useState<AutoscalingState>(null);

  const { data: pools, isPending: isPoolsPending } = useClusterNodePools(
    projectId,
    clusterId,
  );

  const pool = useMemo(() => pools?.find((p) => p.id === poolId), [
    pools,
    poolId,
  ]);

  useEffect(() => {
    if (pool) {
      setState({
        quantity: {
          desired: pool?.desiredNodes,
          min: pool?.minNodes,
          max: pool?.maxNodes,
        },
        isAutoscale: pool?.autoscale,
      });
    }
  }, [pool]);

  const { updateSize, isPending: isScaling } = useUpdateNodePoolSize({
    onError(cause: Error & { response: { data: { message: string } } }): void {
      addError(
        tScale('kube_node_pool_autoscaling_scale_error', {
          message: cause?.response?.data?.message,
        }),
      );
      goBack();
    },
    onSuccess: async () => {
      trackClick(`details::nodepools::scale::confirm`);
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'kubernetes', clusterId, 'nodePools'],
      });
      addSuccess(tScale('kube_node_pool_autoscaling_scale_success'));
      goBack();
    },
    projectId,
    clusterId,
    poolId,
  });

  return (
    <OsdsModal
      headline={tListing('kube_common_node_pool_autoscaling_title')}
      onOdsModalClose={() => {
        trackClick(`details::nodepools::scale::cancel`);
        goBack();
      }}
    >
      <slot name="content">
        {!isPoolsPending && !isScaling ? (
          <Autoscaling
            initialScaling={{
              min: pool?.minNodes,
              max: pool?.maxNodes,
              desired: pool?.desiredNodes,
            }}
            isMonthlyBilling={pool?.monthlyBilled}
            isAntiAffinity={pool?.antiAffinity}
            autoscale={pool?.autoscale}
            onChange={(s) => setState(s)}
          />
        ) : (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
          />
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
            autoscale: state.isAutoscale,
            desiredNodes: state.quantity.desired,
            maxNodes: state.quantity.max,
            minNodes: state.quantity.min,
          });
        }}
        {...(isScaling ? { disabled: true } : {})}
      >
        {tListing('kube_common_save')}
      </OsdsButton>
    </OsdsModal>
  );
}
