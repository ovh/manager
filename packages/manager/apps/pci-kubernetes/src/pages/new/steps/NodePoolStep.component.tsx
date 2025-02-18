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
import { Datagrid } from '@ovh-ux/manager-react-components';
import { AutoscalingState } from '@/components/Autoscaling.component';
import {
  ANTI_AFFINITY_MAX_NODES,
  NAME_INPUT_CONSTRAINTS,
  NODE_RANGE,
  TAGS_BLOB,
} from '@/constants';
import { useClusterCreationStepper } from '../useCusterCreationStepper';
import BillingStep from '@/components/create/BillingStep.component';
import { MAX_LENGTH } from './ClusterNameStep.component';
import { useDatagridColumn } from './node-pool/useDataGridColumn';
import NodePoolToggle from './node-pool/NodePoolToggle.component';
import NodePoolName from './node-pool/NodePoolName.component';
import NodePoolType from './node-pool/NodePoolType.component';
import NodePoolSize from './node-pool/NodePoolSize.component';
import NodePoolAntiAffinity from './node-pool/NodePoolAntiAffinity.component';

import { NodePool } from '@/api/data/kubernetes';
import { generateUniqueName } from '@/helpers';

const NodePoolStep = ({
  stepper,
}: {
  stepper: ReturnType<typeof useClusterCreationStepper>;
}) => {
  const { t: tStepper } = useTranslation('stepper');
  const { t: tNodePool } = useTranslation('node-pool');

  const [scaling, setScaling] = useState<AutoscalingState | null>(null);
  const [antiAffinity, setIsAntiaffinity] = useState(false);
  const [name, setName] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const isValidName =
    name?.length <= MAX_LENGTH && NAME_INPUT_CONSTRAINTS.PATTERN.exec(name);
  const hasError = isTouched && !isValidName;
  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [flavor, setFlavor] = useState<KubeFlavor | null>(null);

  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const [nodes, setNodes] = useState<NodePool[] | null>(null);
  const onDelete = useCallback(
    (nameToDelete: string) =>
      nodes && setNodes(nodes.filter((node) => node.name !== nameToDelete)),
    [nodes],
  );
  const columns = useDatagridColumn({ onDelete });

  const isNodePoolValid = !nodePoolEnabled || (Boolean(flavor) && isValidName);

  const exceedsMaxNodes = (quantity: number) => quantity > NODE_RANGE.MAX;
  const { projectId } = useParams();
  // The maxValue is NODE_RANGE.MAX cause isAntiAffinity is hardcoded to false
  // change to ANTI_AFFINITY_MAX_NODES otherwise
  const isScalingValid = useMemo(() => {
    if (!scaling) return true;

    const { isAutoscale, quantity } = scaling;
    const { desired, min, max } = quantity;

    if (!isAutoscale) {
      return !exceedsMaxNodes(desired);
    }

    const isMinValid = min >= 0 && min <= max;
    const isMaxValid = max <= NODE_RANGE.MAX;
    const isDesiredInRange = min <= desired && max >= desired;

    return isMinValid && isMaxValid && isDesiredInRange;
  }, [scaling]);

  const hasMax5NodesAntiAffinity =
    !antiAffinity ||
    (antiAffinity &&
      scaling &&
      scaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES);
  const isButtonDisabled =
    !isScalingValid || !isNodePoolValid || !hasMax5NodesAntiAffinity;

  const price = useMemo(() => {
    if (flavor && scaling) {
      return {
        hour: flavor.pricingsHourly.price * scaling.quantity.desired,
        month: flavor.pricingsMonthly?.price * scaling.quantity.desired,
      };
    }
    return { hour: 0, month: 0 };
  }, [flavor, scaling?.quantity.desired]);

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
      setScaling(null);
      setFlavor(null);
      setName('');
      setIsTouched(false);
    }
  }, [nodePoolEnabled]);

  return (
    <>
      <NodePoolToggle
        nodePoolEnabled={nodePoolEnabled}
        onNodePoolEnabledChange={setNodePoolEnabled}
      />
      <div className="bo border-">
        {!stepper.node.step.isLocked && nodePoolEnabled && (
          <>
            <div className="mb-8">
              <NodePoolName
                onTouched={setIsTouched}
                hasError={hasError}
                onNameChange={setName}
                name={name}
              />
            </div>
            <div className="mb-8">
              <NodePoolType
                projectId={projectId as string}
                region={stepper.form.region.name}
                onFlavorChange={setFlavor}
              />
            </div>
            <div className="mb-8">
              <NodePoolSize
                isMonthlyBilled={isMonthlyBilled}
                onScaleChange={setScaling}
                antiAffinity={antiAffinity}
              />
            </div>
            <div className="mb-8">
              <NodePoolAntiAffinity
                isChecked={antiAffinity}
                isEnabled={!scaling?.isAutoscale}
                onChange={setIsAntiaffinity}
              />
            </div>
            <div className="mb-8">
              <BillingStep
                price={price.hour}
                monthlyPrice={price.month}
                monthlyBilling={{
                  isComingSoon: isPricingComingSoon ?? false,
                  isChecked: isMonthlyBilled,
                  check: setIsMonthlyBilled,
                }}
                warn={(scaling?.isAutoscale && isMonthlyBilled) ?? false}
              />
            </div>
          </>
        )}
        {!stepper.node.step.isLocked && (
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.stroked}
            className="my-6 w-fit"
            disabled={!nodes || !scaling || !flavor || undefined}
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_TEXT_COLOR_INTENT.primary}
            {...(isButtonDisabled ? { disabled: true } : {})}
            onClick={() => {
              if (nodes || scaling || flavor) {
                const newNodePool: NodePool = {
                  name: generateUniqueName(name, nodes as NodePool[]),
                  antiAffinity,
                  autoscale: scaling.isAutoscale,
                  localisation: stepper.form.region.name,
                  desiredNodes: scaling.quantity.desired,
                  minNodes: scaling.quantity.min,
                  flavorName: flavor.name,
                  maxNodes: antiAffinity
                    ? Math.min(ANTI_AFFINITY_MAX_NODES, scaling.quantity.max)
                    : scaling.quantity.max,
                  monthlyBilled: isMonthlyBilled,
                };
                setName('');
                setIsTouched(false);
                setNodes([...nodes, newNodePool]);
              }
            }}
          >
            {tNodePool('kube_common_add_node_pool')}
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
              {tNodePool('kube_common_node_pool_liste')}
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
            {tStepper('common_stepper_next_button_label')}
          </OsdsButton>
        )}
      </div>
    </>
  );
};

export default NodePoolStep;
