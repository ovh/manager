import { ReactElement, useEffect, useMemo, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { flow, isEqual, set } from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { Modal, ModalBody, ModalContent, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { isApiCustomError } from '@ovh-ux/manager-core-api';
import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice, useNotifications } from '@ovh-ux/manager-react-components';

import { useClusterNodePools, useUpdateNodePool } from '@/api/hooks/node-pools';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { Autoscaling } from '@/components/Autoscaling.component';
import { NODE_RANGE } from '@/constants';
import { isScalingValid } from '@/helpers/node-pool';
import { useTrack } from '@/hooks/track';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import PublicConnectivity from '@/pages/new/steps/node-pool/PublicConnectivity.component';
import { queryClient } from '@/queryClient';
import { DeploymentMode, TAttachFloatingIPs, TScalingState } from '@/types';

import { FloatingIPDisableWarning, FloatingIPEnableWarning } from './components/WarningFloatingIPs';

type TScalePageState = {
  scale: TScalingState;
  attachFloatingIPs?: TAttachFloatingIPs;
};

const hasStateChanged = (currentState: unknown, initialState: unknown): boolean => {
  if (!currentState || !initialState) return false;

  return !isEqual(currentState, initialState);
};

const hasQuantityChanged = (
  current: { min: number; max: number },
  initial: { min: number; max: number },
): boolean => current.min !== initial.min || current.max !== initial.max;

export default function ScalePage(): ReactElement {
  const { projectId, kubeId: clusterId } = useSafeParams('projectId', 'kubeId');
  const [searchParams] = useSearchParams();
  const poolId = searchParams.get('nodePoolId') as string;

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addError, addSuccess } = useNotifications();

  const { t } = useTranslation(['scale', 'listing', 'node-pool', NAMESPACES.ACTIONS]);

  const { trackClick } = useTrack();

  const { data: cluster } = useKubernetesCluster(projectId, clusterId);
  const { data: regionInformations } = useRegionInformations(projectId, cluster?.region ?? null);
  const floatingIpPriceData = useFloatingIpsPrice(true, regionInformations?.type ?? null);
  const floatingIpPrice = floatingIpPriceData.price;

  const isStandardPlan = regionInformations?.type === DeploymentMode.MULTI_ZONES;

  const { data: pool, isPending: isPoolsPending } = useClusterNodePools(
    projectId,
    clusterId,
    (pools) => {
      return pools?.find((p) => p.id === poolId);
    },
  );

  const initialState = useMemo(
    () =>
      pool
        ? {
          scale: {
            quantity: {
              desired: pool.desiredNodes,
              min: pool.minNodes,
              max: pool.maxNodes,
            },
            isAutoscale: pool.autoscale,
          },
          ...(has3AZFeature && isStandardPlan
            ? { attachFloatingIPs: pool.attachFloatingIPs ?? { enabled: false } }
            : {}),
        }
        : null,
    [pool],
  );

  const [state, setState] = useState<TScalePageState | null>(null);

  const hasFloatingIPChanged =
    !!initialState?.attachFloatingIPs?.enabled !== !!state?.attachFloatingIPs?.enabled;
  const showEnabledFloatingIp = hasFloatingIPChanged && state?.attachFloatingIPs?.enabled;
  const showDisabledFloatingIp =
    hasFloatingIPChanged && state?.attachFloatingIPs?.enabled === false;

  const hasChanges = useMemo(() => hasStateChanged(state, initialState), [state, initialState]);

  const { update: updateNodePool, isPending: isPendingScaling } = useUpdateNodePool({
    onError(cause: Error) {
      if (isApiCustomError(cause)) {
        addError(
          t('kube_node_pool_autoscaling_scale_error', {
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
      addSuccess(t('kube_node_pool_autoscaling_scale_success'), true);
      goBack();
    },
    projectId,
    clusterId,
    poolId,
  });

  const resetMaxMin = (actualState: TScalePageState | null) => {
    if (!initialState || !actualState) {
      return actualState;
    }
    return flow(
      set('scale.quantity.min', initialState.scale.quantity.min),
      set('scale.quantity.max', initialState.scale.quantity.max),
    )(actualState) as TScalePageState;
  };

  useEffect(() => {
    if (pool) {
      setState(initialState);
    }
  }, [pool, initialState]);

  useEffect(() => {
    if (!state || !initialState || state.scale.isAutoscale) {
      return;
    }

    if (hasQuantityChanged(state.scale.quantity, initialState.scale.quantity)) {
      if (state) {
        setState((state) => state && resetMaxMin(state));
      }
    }
  }, [state?.scale.quantity, initialState?.scale.quantity, state?.scale.isAutoscale]);

  const isDisabled =
    isPendingScaling ||
    (state &&
      !isScalingValid({ quantity: state.scale.quantity, isAutoscale: state?.scale.isAutoscale })) ||
    !hasChanges;

  const { price: priceFloatingIp } = useFloatingIpsPrice(true, regionInformations?.type ?? null);
  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const has3AZFeature = use3AZPlanAvailable();

  const scaleObject = useMemo(() => {
    const { desired, min, max } = state?.scale.quantity || {};
    const d = Number(desired),
      mn = Number(min),
      mx = Number(max);

    if (state?.scale.isAutoscale) {
      return { maxNodes: mx || NODE_RANGE.MAX, minNodes: mn || 0 };
    }

    if (d < mn) return { minNodes: d };
    if (d > mx) return { maxNodes: d };
    return {};
  }, [state?.scale.quantity, state?.scale.isAutoscale]);

  const onClose = (open: boolean) => {
    if (!open) {
      trackClick(`details::nodepools::scale::cancel`);
      goBack();
    }
  };

  const handleChangeFloatingIp = (status: boolean) => {
    if (state) {
      setState({
        ...state,
        attachFloatingIPs: { enabled: status },
      });
    }
  };

  return (
    // TODO replace modal by Drawer in ODS 19
    <Modal
      defaultOpen
      closeOnEscape={false}
      closeOnInteractOutside={false}
      onOpenChange={(e) => onClose(e.open)}
    >
      <ModalContent className="max-h-[90vh] w-[900px] max-w-[90vw] overflow-auto">
        <ModalBody className="">
          <Text preset="heading-3" className="text-[--ods-color-primary-500]">
            {t('listing:kube_common_node_pool_autoscaling_title')}
          </Text>
          {!isPoolsPending && !isPendingScaling && state && pool ? (
            <>
              {has3AZFeature && isStandardPlan && (
                <>
                  <PublicConnectivity
                    checked={Boolean(state.attachFloatingIPs?.enabled)}
                    onChange={handleChangeFloatingIp}
                    price={floatingIpPrice}
                  />
                  {showEnabledFloatingIp && priceFloatingIp && (
                    <FloatingIPEnableWarning
                      price={priceFloatingIp}
                      getFormattedPrice={getFormattedHourlyCatalogPrice}
                    />
                  )}
                  {showDisabledFloatingIp && <FloatingIPDisableWarning />}
                </>
              )}
              <div className="mb-8">
                <Text
                  className="font-bold text-[--ods-color-text-500]"
                  preset={TEXT_PRESET.heading4}
                >
                  {t('node-pool:kube_common_node_pool_size_title')}
                </Text>
                <Autoscaling
                  initialScaling={state.scale.quantity}
                  isMonthlyBilling={pool.monthlyBilled}
                  isAntiAffinity={pool.antiAffinity}
                  isAutoscale={!!state.scale.isAutoscale}
                  onChange={({ isAutoscale, quantity }) =>
                    setState({
                      ...state,
                      scale: {
                        isAutoscale,
                        quantity,
                      },
                    })
                  }
                />
              </div>
            </>
          ) : (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="block text-center" />
          )}
          <div className="mt-6 flex justify-end gap-4">
            <OsdsButton
              slot="actions"
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
              onClick={goBack}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </OsdsButton>
            <OsdsButton
              slot="actions"
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                updateNodePool({
                  autoscale: state?.scale.isAutoscale ?? false,
                  desiredNodes: state?.scale.quantity.desired ?? NODE_RANGE.MIN,
                  ...(state?.attachFloatingIPs
                    ? { attachFloatingIPs: state?.attachFloatingIPs }
                    : {}),
                  ...scaleObject,
                });
              }}
              {...(isDisabled ? { disabled: true } : {})}
            >
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </OsdsButton>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
