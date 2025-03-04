import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { KubeFlavor } from '@ovh-ux/manager-pci-common';
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
import { AutoscalingState } from '@/components/Autoscaling.component';
import {
  ANTI_AFFINITY_MAX_NODES,
  NAME_INPUT_CONSTRAINTS,
  NODE_RANGE,
  TAGS_BLOB,
} from '@/constants';
import { useClusterCreationStepper } from '../useCusterCreationStepper';
import BillingStep from '@/components/create/BillingStep.component';
import { getDatagridColumns } from './node-pool/getDataGridColumns';
import NodePoolToggle from './node-pool/NodePoolToggle.component';
import NodePoolName from './node-pool/NodePoolName.component';
import NodePoolType from './node-pool/NodePoolType.component';
import NodePoolSize from './node-pool/NodePoolSize.component';
import NodePoolAntiAffinity from './node-pool/NodePoolAntiAffinity.component';

import { NodePool, NodePoolPrice } from '@/api/data/kubernetes';
import { generateUniqueName } from '@/helpers';

const getPrice = (flavor: KubeFlavor, scaling: AutoscalingState | null) => {
  if (flavor && scaling) {
    return {
      hour: flavor.pricingsHourly.price * scaling.quantity.desired,
      month: flavor.pricingsMonthly
        ? flavor.pricingsMonthly.price * scaling.quantity.desired
        : null,
    };
  }
  return { hour: 0, month: 0 };
};

type NodePoolState = {
  antiAffinity: boolean;
  name: string;
  isTouched: boolean;
  scaling: AutoscalingState | null;
};

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
    scaling: null,
  });

  const isValidName =
    nodePoolState.name?.length <= NAME_INPUT_CONSTRAINTS.MAX_LENGTH &&
    NAME_INPUT_CONSTRAINTS.PATTERN.exec(nodePoolState.name);
  const hasError = nodePoolState.isTouched && !isValidName;
  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [flavor, setFlavor] = useState<KubeFlavor | null>(null);

  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const [nodes, setNodes] = useState<NodePoolPrice[] | null>(null);
  const onDelete = useCallback(
    (nameToDelete: string) =>
      nodes && setNodes(nodes.filter((node) => node.name !== nameToDelete)),
    [nodes],
  );
  const columns = getDatagridColumns({ onDelete, t });

  const isNodePoolValid = !nodePoolEnabled || (Boolean(flavor) && isValidName);

  const exceedsMaxNodes = (quantity: number) => quantity > NODE_RANGE.MAX;
  const { projectId } = useParams();
  // The maxValue is NODE_RANGE.MAX cause isAntiAffinity is hardcoded to false
  // change to ANTI_AFFINITY_MAX_NODES otherwise
  const isScalingValid = useMemo(() => {
    if (!nodePoolState.scaling) return true;

    const { isAutoscale, quantity } = nodePoolState.scaling;
    const { desired, min, max } = quantity;

    if (!isAutoscale) {
      return !exceedsMaxNodes(desired);
    }

    const isMinValid = min >= 0 && min <= max;
    const isMaxValid = max <= NODE_RANGE.MAX;
    const isDesiredInRange = min <= desired && max >= desired;

    return isMinValid && isMaxValid && isDesiredInRange;
  }, [nodePoolState.scaling]);

  const hasMax5NodesAntiAffinity =
    !nodePoolState.antiAffinity ||
    (nodePoolState.antiAffinity &&
      nodePoolState.scaling &&
      nodePoolState.scaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES);
  const isButtonDisabled =
    !isScalingValid || !isNodePoolValid || !hasMax5NodesAntiAffinity;

  const price = useMemo(() => {
    if (flavor && nodePoolState.scaling) {
      return {
        hour:
          flavor.pricingsHourly.price * nodePoolState.scaling.quantity.desired,
        month:
          flavor.pricingsMonthly?.price *
          nodePoolState.scaling.quantity.desired,
      };
    }
    return { hour: 0, month: 0 };
  }, [flavor, nodePoolState.scaling?.quantity.desired]);

  const isPricingComingSoon = flavor?.blobs?.tags?.includes(
    TAGS_BLOB.COMING_SOON,
  );

  const isStepUnlocked = !stepper.node.step.isLocked;

  const canSubmit =
    (isStepUnlocked && !nodePoolEnabled) ||
    (isStepUnlocked && nodePoolEnabled && nodes?.length > 0);

  useEffect(() => setIsMonthlyBilled(false), [flavor]);

  useEffect(() => {
    setNodes(!nodePoolEnabled ? null : []);
    if (!nodePoolEnabled) {
      setNodePoolState((state) => ({
        ...state,
        scaling: null,
        flavor: null,
        name: '',
        isTouched: false,
      }));
    }
  }, [nodePoolEnabled]);

  const setNewNodePool = useCallback(() => {
    if (nodes || nodePoolState.scaling || flavor) {
      const newNodePool: NodePoolPrice = {
        name: generateUniqueName(nodePoolState.name, nodes as NodePool[]),
        antiAffinity: nodePoolState.antiAffinity,
        autoscale: nodePoolState.scaling.isAutoscale,
        localisation: stepper.form.region.name,
        desiredNodes: nodePoolState.scaling.quantity.desired,
        minNodes: nodePoolState.scaling.quantity.min,
        flavorName: flavor.name,
        maxNodes: nodePoolState.antiAffinity
          ? Math.min(
              ANTI_AFFINITY_MAX_NODES,
              nodePoolState.scaling.quantity.max,
            )
          : nodePoolState.scaling.quantity.max,
        monthlyPrice: flavor.pricingsMonthly
          ? getPrice(flavor, nodePoolState.scaling).month
          : convertHourlyPriceToMonthly(
              getPrice(flavor, nodePoolState.scaling).hour,
            ),
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
    stepper.form.region.name,
    flavor,
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
        {!stepper.node.step.isLocked && nodePoolEnabled && (
          <>
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
            <div className="mb-8">
              <NodePoolType
                projectId={projectId as string}
                region={stepper.form.region.name}
                onSelect={setFlavor}
              />
            </div>
            <div className="mb-8">
              <NodePoolSize
                isMonthlyBilled={isMonthlyBilled}
                onScaleChange={(scaling: AutoscalingState) =>
                  setNodePoolState((state) => ({ ...state, scaling }))
                }
                antiAffinity={nodePoolState.antiAffinity}
              />
            </div>
            <div className="mb-8">
              <NodePoolAntiAffinity
                isChecked={nodePoolState.antiAffinity}
                isEnabled={!nodePoolState.scaling?.isAutoscale}
                onChange={(antiAffinity: boolean) =>
                  setNodePoolState((state) => ({ ...state, antiAffinity }))
                }
              />
            </div>
            <div className="mb-8">
              <BillingStep
                price={getPrice(flavor, nodePoolState.scaling).hour}
                monthlyPrice={getPrice(flavor, nodePoolState.scaling).month}
                monthlyBilling={{
                  isComingSoon: isPricingComingSoon ?? false,
                  isChecked: isMonthlyBilled,
                  check: setIsMonthlyBilled,
                }}
                warn={
                  (nodePoolState.scaling?.isAutoscale && isMonthlyBilled) ??
                  false
                }
              />
            </div>
          </>
        )}
        {!stepper.node.step.isLocked && nodePoolEnabled && (
          <OsdsButton
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
