import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { KubeFlavor } from '@ovh-ux/manager-pci-common';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { AutoscalingState } from '@/components/Autoscaling.component';
import { NAME_INPUT_CONSTRAINTS, NODE_RANGE, TAGS_BLOB } from '@/constants';
import { useClusterCreationStepper } from '../useCusterCreationStepper';
import BillingStep from '@/components/create/BillingStep.component';
import { MAX_LENGTH, NAME_PATTERN } from './ClusterNameStep.component';
import NodePoolToggle from './node-pool/NodePoolToggle.component';
import NodePoolName from './node-pool/NodePoolName.component';
import NodePoolType from './node-pool/NodePoolType.component';
import NodePoolSize from './node-pool/NodePoolSize.component';
import NodePoolAntiAffinity from './node-pool/NodePoolAntiAffinity.component';

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

  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);

  const isNodePoolValid = !nodePoolEnabled || (flavor && isValidName);

  const exceedsMaxNodes = (quantity) => quantity > NODE_RANGE.MAX;
  const { projectId } = useParams();
  // The maxValue is NODE_RANGE.MAX cause isAntiAffinity is hardcoded to false
  // change to ANTI_AFFINITY_MAX_NODES otherwise
  const isScalingValid =
    !scaling ||
    (!scaling.isAutoscale && exceedsMaxNodes(scaling.quantity.desired)) ||
    (scaling.isAutoscale &&
      (exceedsMaxNodes(scaling.quantity.min) ||
        exceedsMaxNodes(scaling.quantity.max) ||
        scaling.quantity.min >= scaling.quantity.max));

  const isButtonDisabled = !isScalingValid && !isNodePoolValid;

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

  useEffect(() => {
    if (!nodePoolEnabled) {
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
              nodePoolEnabled={nodePoolEnabled}
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
      {!stepper.node.step.isLocked && (
        <OsdsButton
          onClick={() =>
            stepper.node.submit({
              flavor,
              scaling,
              isMonthlyBilled,
              antiAffinity,
              nodePoolName: name,
            })
          }
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_TEXT_COLOR_INTENT.primary}
          {...(isButtonDisabled ? { disabled: true } : {})}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
};

export default NodePoolStep;
