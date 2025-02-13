import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { KubeFlavor } from '@ovh-ux/manager-pci-common';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
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

const NodePoolStep = ({
  stepper,
}: {
  stepper: ReturnType<typeof useClusterCreationStepper>;
}) => {
  const { t: tStepper } = useTranslation('stepper');

  const [scaling, setScaling] = useState<AutoscalingState | null>(null);
  const [antiAffinity, setIsAntiaffinity] = useState(false);
  const [name, setName] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const isValidName =
    name?.length <= MAX_LENGTH && NAME_INPUT_CONSTRAINTS.PATTERN.exec(name);
  const hasError = isTouched && !isValidName;
  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [flavor, setFlavor] = useState<KubeFlavor | null>(null);
  const columns = useDatagridColumn();
  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const [nodes, setNodes] = useState<NodePool[]>([]);

  const isNodePoolValid = !nodePoolEnabled || (Boolean(flavor) && isValidName);

  const exceedsMaxNodes = (quantity) => quantity > NODE_RANGE.MAX;
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
    (antiAffinity && scaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES);
  const isButtonDisabled =
    !isScalingValid || !isNodePoolValid || !hasMax5NodesAntiAffinity;

  const price = useMemo(() => {
    if (flavor) {
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

  useEffect(() => setIsMonthlyBilled(false), [flavor]);

  useEffect(() => {
    if (!nodePoolEnabled) {
      setNodes(null);
      setScaling(null);
      setFlavor(null);
    }
  }, [nodePoolEnabled]);

  return (
    <>
      <NodePoolToggle
        nodePoolEnabled={nodePoolEnabled}
        onNodePoolEnabledChange={setNodePoolEnabled}
      />

      {nodePoolEnabled && (
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
              projectId={projectId}
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
                isComingSoon: isPricingComingSoon,
                isChecked: isMonthlyBilled,
                check: setIsMonthlyBilled,
              }}
              warn={scaling?.isAutoscale && isMonthlyBilled}
            />
          </div>
        </>
      )}
      <OsdsButton
        className="mt-4 w-fit"
        size={ODS_BUTTON_SIZE.md}
        color={ODS_TEXT_COLOR_INTENT.primary}
        {...(isButtonDisabled ? { disabled: true } : {})}
        onClick={() => {
          const newNodePool = {
            name,
            antiAffinity,
            autoscale: Boolean(scaling?.isAutoscale),
            desiredNodes: scaling?.quantity.desired,
            minNodes: scaling?.quantity.min,
            flavorName: flavor?.name,
            maxNodes: antiAffinity
              ? Math.min(ANTI_AFFINITY_MAX_NODES, scaling?.quantity.max)
              : scaling?.quantity.max,
            monthlyBilled: isMonthlyBilled,
          };

          setNodes([...nodes, newNodePool]);
        }}
      >
        Add Node Pool
      </OsdsButton>

      <Datagrid
        columns={columns}
        items={nodes}
        totalItems={nodes.length}
        className="overflow-x-visible"
      />

      {!stepper.node.step.isLocked && (
        <OsdsButton
          onClick={() => stepper.node.submit(nodes)}
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_TEXT_COLOR_INTENT.primary}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
};

export default NodePoolStep;
