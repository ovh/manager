import { useCallback, useEffect, useMemo, useState } from 'react';

import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  convertHourlyPriceToMonthly,
  Datagrid,
} from '@ovh-ux/manager-react-components';
import { TScalingState, NodePoolState } from '@/types';
import { NODE_RANGE, TAGS_BLOB } from '@/constants';
import { useClusterCreationStepper } from '../hooks/useCusterCreationStepper';
import BillingStep from '@/components/create/BillingStep.component';
import { getDatagridColumns } from './node-pool/getDataGridColumns';
import NodePoolToggle from './node-pool/NodePoolToggle.component';
import NodePoolName from './node-pool/NodePoolName.component';
import NodePoolType from './node-pool/NodePoolType.component';
import NodePoolSize from './node-pool/NodePoolSize.component';
import NodePoolAntiAffinity from './node-pool/NodePoolAntiAffinity.component';
import { NodePoolPrice } from '@/api/data/kubernetes';
import { generateUniqueName, isMultiDeploymentZones } from '@/helpers';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import DeploymentZone from './node-pool/DeploymentZone.component';
import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useMergedFlavorById, {
  getPriceByDesiredScale,
} from '@/hooks/useMergedFlavorById';
import { isNodePoolNameValid } from '@/helpers/matchers/matchers';
import { hasInvalidScalingOrAntiAffinityConfig } from '@/helpers/node-pool';

const NodePoolStep = ({
  stepper,
}: {
  stepper: ReturnType<typeof useClusterCreationStepper>;
}) => {
  const { t } = useTranslation([
    'stepper',
    'node-pool',
    'add',
    'kube-nodes',
    'autoscaling',
    'flavor-billing',
    'billing-anti-affinity',
  ]);

  const [nodePoolState, setNodePoolState] = useState<NodePoolState>({
    antiAffinity: false,
    name: '',
    isTouched: false,
    scaling: {
      quantity: { desired: NODE_RANGE.MIN, min: 0, max: NODE_RANGE.MAX },
      isAutoscale: false,
    },
  });

  const isValidName = isNodePoolNameValid(nodePoolState.name);

  const hasError = nodePoolState.isTouched && !isValidName;
  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [
    selectedFlavor,
    setSelectedFlavor,
  ] = useState<TComputedKubeFlavor | null>(null);

  const featureFlipping3az = use3AZPlanAvailable();
  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const [nodes, setNodes] = useState<NodePoolPrice[] | null>(null);
  const onDelete = useCallback(
    (nameToDelete: string) =>
      nodes && setNodes(nodes.filter((node) => node.name !== nameToDelete)),
    [nodes],
  );
  const columns = useMemo(() => getDatagridColumns({ onDelete, t }), [
    onDelete,
    t,
  ]);

  const isNodePoolValid =
    !nodePoolEnabled || (Boolean(selectedFlavor) && isValidName);

  const { projectId } = useSafeParams('projectId');

  const price = useMergedFlavorById<{ hour: number; month?: number } | null>(
    projectId,
    stepper.form.region?.name ?? null,
    selectedFlavor?.id ?? null,
    {
      select: (flavor) =>
        getPriceByDesiredScale(
          flavor.pricingsHourly?.price,
          flavor.pricingsMonthly?.price,
          nodePoolState.scaling?.quantity.desired,
        ),
    },
  );

  const { data: regionInformations } = useRegionInformations(
    projectId,
    stepper.form.region?.name ?? null,
  );

  const isButtonDisabled =
    !isNodePoolValid ||
    (regionInformations &&
      hasInvalidScalingOrAntiAffinityConfig(regionInformations, nodePoolState));

  const isPricingComingSoon = selectedFlavor?.blobs?.tags?.includes(
    TAGS_BLOB.COMING_SOON,
  );

  const isStepUnlocked = !stepper.node.step.isLocked;

  const canSubmit =
    (isStepUnlocked && !nodePoolEnabled) ||
    (isStepUnlocked &&
      nodePoolEnabled &&
      Array.isArray(nodes) &&
      nodes.length > 0);

  useEffect(() => setIsMonthlyBilled(false), [selectedFlavor]);

  useEffect(() => {
    setNodes(!nodePoolEnabled ? null : []);
    if (!nodePoolEnabled) {
      setNodePoolState((state) => ({
        ...state,

        name: '',
        isTouched: false,
      }));
    }
  }, [nodePoolEnabled]);

  const setNewNodePool = useCallback(() => {
    if (nodes && nodePoolState.scaling && selectedFlavor) {
      const newNodePool: NodePoolPrice = {
        name: generateUniqueName(nodePoolState.name, nodes),
        antiAffinity: nodePoolState.antiAffinity,
        autoscale: nodePoolState.scaling.isAutoscale,
        ...(regionInformations?.type &&
          isMultiDeploymentZones(regionInformations.type) &&
          nodePoolState.selectedAvailabilityZone && {
            availabilityZones: [nodePoolState.selectedAvailabilityZone],
          }),
        localisation:
          nodePoolState.selectedAvailabilityZone ??
          stepper.form.region?.name ??
          null,
        desiredNodes: nodePoolState.scaling.quantity.desired,
        ...(nodePoolState.scaling.isAutoscale && {
          minNodes: nodePoolState.scaling.quantity.min,
          maxNodes: nodePoolState.scaling.quantity.max,
        }),
        flavorName: selectedFlavor.name ?? '',

        monthlyPrice: isMonthlyBilled
          ? price?.month ?? 0
          : convertHourlyPriceToMonthly(price?.hour ?? 0),
        monthlyBilled: isMonthlyBilled,
      };
      setNodePoolState((state) => ({
        ...state,
        name: '',
        isTouched: false,
      }));
      setNodes([...nodes, newNodePool]);
    }
  }, [
    nodePoolState,
    nodes,
    stepper.form.region?.name,
    selectedFlavor,
    isMonthlyBilled,
    setNodePoolState,
    setNodes,
  ]);

  return (
    <>
      {((!stepper.node.step.isLocked && nodePoolEnabled) ||
        !nodePoolEnabled) && (
        <NodePoolToggle
          nodePoolEnabled={nodePoolEnabled}
          step={stepper.node.step}
          onNodePoolEnabledChange={setNodePoolEnabled}
        />
      )}
      <div className="bo border-">
        <div
          className={
            !stepper.node.step.isLocked && nodePoolEnabled
              ? 'visible'
              : 'invisible w-0 h-0 overflow-hidden'
          }
        >
          <div className="mb-8 mt-4">
            {stepper.form.region?.name && (
              <NodePoolType
                projectId={projectId}
                region={stepper.form.region.name}
                onSelect={setSelectedFlavor}
              />
            )}
          </div>
          {featureFlipping3az &&
            regionInformations?.type &&
            isMultiDeploymentZones(regionInformations.type) && (
              <div className="mb-8 flex gap-4">
                <DeploymentZone
                  onSelect={(zone) =>
                    setNodePoolState((state) => ({
                      ...state,
                      selectedAvailabilityZone: zone,
                    }))
                  }
                  availabilityZones={regionInformations?.availabilityZones}
                  selectedAvailabilityZone={
                    nodePoolState.selectedAvailabilityZone ?? ''
                  }
                />
              </div>
            )}
          <div className="mb-8">
            <NodePoolSize
              isMonthlyBilled={isMonthlyBilled}
              onScaleChange={(scaling: TScalingState) =>
                setNodePoolState((state) => ({ ...state, scaling }))
              }
              antiAffinity={nodePoolState.antiAffinity}
            />
          </div>
          {regionInformations?.type &&
            !isMultiDeploymentZones(regionInformations.type) && (
              <div className="mb-8">
                <NodePoolAntiAffinity
                  isChecked={nodePoolState.antiAffinity}
                  isEnabled={!nodePoolState.scaling?.isAutoscale}
                  onChange={(antiAffinity: boolean) =>
                    setNodePoolState((state) => ({ ...state, antiAffinity }))
                  }
                />
              </div>
            )}
          <div className="mb-8">
            <BillingStep
              price={price?.hour ?? null}
              monthlyPrice={price?.month}
              monthlyBilling={{
                isComingSoon: isPricingComingSoon ?? false,
                isChecked: isMonthlyBilled,
                check: setIsMonthlyBilled,
              }}
              warn={
                (nodePoolState.scaling?.isAutoscale && isMonthlyBilled) ?? false
              }
            />
          </div>
          <div className="mb-8">
            <NodePoolName
              onTouched={(isTouched: boolean) =>
                setNodePoolState((state) => ({ ...state, isTouched }))
              }
              hasError={hasError}
              onNameChange={(name: string) =>
                setNodePoolState((state) => ({ ...state, name }))
              }
              name={nodePoolState.name}
            />
          </div>
        </div>

        {!stepper.node.step.isLocked && nodePoolEnabled && (
          <OsdsButton
            data-testid="button-add-node"
            variant={ODS_BUTTON_VARIANT.stroked}
            className="my-6 w-fit"
            disabled={isButtonDisabled || !nodes || undefined}
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_TEXT_COLOR_INTENT.primary}
            onClick={setNewNodePool}
          >
            {t('node-pool:kube_common_add_node_pool')}
          </OsdsButton>
        )}

        {nodes && (
          <>
            <OsdsText
              className="mb-4 font-bold"
              color={ODS_TEXT_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
              slot="label"
            >
              {t('node-pool:kube_common_node_pool_liste')}
            </OsdsText>
            <Datagrid
              columns={columns}
              items={nodes}
              totalItems={nodes.length}
              className="overflow-x-visible"
            />
          </>
        )}
        {canSubmit && (
          <OsdsButton
            data-testid="submit-button-node"
            onClick={() => {
              stepper.node.submit(nodes);
            }}
            className="mt-4 w-fit"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_TEXT_COLOR_INTENT.primary}
          >
            {t('common_stepper_next_button_label')}
          </OsdsButton>
        )}
      </div>
    </>
  );
};

export default NodePoolStep;
