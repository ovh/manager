import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  OsdsButton,
  OsdsText,
  OsdsInput,
  OsdsFormField,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import { KubeFlavor } from '@ovh-ux/manager-pci-common';
import {
  ODS_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import {
  Autoscaling,
  AutoscalingState,
} from '@/components/Autoscaling.component';
import { NODE_RANGE, TAGS_BLOB } from '@/constants';
import { useClusterCreationStepper } from '../useCusterCreationStepper';
import { NodeTypeStep } from './NodeTypeStep.component';
import Estimation from '@/components/create/Estimation.component';
import BillingStep from '@/components/create/BillingStep.component';
import { MAX_LENGTH, NAME_PATTERN } from './ClusterNameStep.component';

const NodePoolStep = ({
  stepper,
}: {
  stepper: ReturnType<typeof useClusterCreationStepper>;
}) => {
  const { t: tStepper } = useTranslation('stepper');
  const { t: tAdd } = useTranslation('add');
  const { t: tNodePool } = useTranslation('node-pool');
  const [scaling, setScaling] = useState<AutoscalingState | null>(null);
  const [antiAffinity, setIsAntiaffinity] = useState(false);
  const [name, setName] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const isValidName = name?.length <= MAX_LENGTH && NAME_PATTERN.test(name);
  const hasError = isTouched && !isValidName;
  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [flavor, setFlavor] = useState<KubeFlavor | null>(null);

  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const { projectId } = useParams();

  const isNodePoolValid = !nodePoolEnabled || !!flavor;

  const exceedsMaxNodes = (quantity) => quantity > NODE_RANGE.MAX;

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
      <OsdsFormField className="mt-8" inline>
        <OsdsToggle
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={nodePoolEnabled || undefined}
          onClick={() => setNodePoolEnabled(!nodePoolEnabled)}
        >
          <OsdsText
            className="ml-4 font-bold"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            slot="end"
          >
            {tNodePool(`kube_common_node_pool_configure_${nodePoolEnabled}`)}
          </OsdsText>
        </OsdsToggle>
      </OsdsFormField>
      <p>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tNodePool('kubernetes_add_node_pool_description')}
        </OsdsText>
      </p>
      {nodePoolEnabled && (
        <OsdsFormField
          class="mt-6"
          error={
            hasError
              ? tAdd(
                  'kubernetes_add_cluster_name_input_pattern_validation_error',
                )
              : ''
          }
          inline
        >
          <OsdsText
            className="ml-4 font-bold"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            slot="end"
          >
            {tAdd('kubernetes_add_name')}
          </OsdsText>
          <OsdsInput
            placeholder={tAdd('kubernetes_add_nodepool_name_placeholder')}
            value={name}
            color={ODS_THEME_COLOR_INTENT.primary}
            type={ODS_INPUT_TYPE.text}
            onOdsValueChange={(e) => {
              setName(e.detail.value);
            }}
            onOdsInputBlur={() => setIsTouched(true)}
            error={hasError}
          />
        </OsdsFormField>
      )}
      <NodeTypeStep
        onFlavorChange={setFlavor}
        flavor={flavor}
        onNodePoolEnabledChange={setNodePoolEnabled}
        nodePoolEnabled={nodePoolEnabled}
        step={stepper.node.step}
        projectId={projectId}
        region={stepper.form.region?.name}
      />
      {nodePoolEnabled && (
        <div className="mb-8">
          <Autoscaling
            autoscale={false}
            isAntiAffinity={false}
            onChange={setScaling}
            isMonthlyBilling={isMonthlyBilled}
          />
        </div>
      )}
      {!nodePoolEnabled ? (
        <Estimation />
      ) : (
        <BillingStep
          price={price.hour}
          monthlyPrice={price.month}
          antiAffinity={{
            isChecked: antiAffinity,
            isEnabled: !scaling?.isAutoscale,
            onChange: setIsAntiaffinity,
          }}
          monthlyBilling={{
            isComingSoon: isPricingComingSoon,
            isChecked: isMonthlyBilled,
            check: setIsMonthlyBilled,
          }}
          warn={scaling?.isAutoscale && isMonthlyBilled}
        />
      )}
      {!stepper.node.step.isLocked && (
        <OsdsButton
          onClick={() =>
            stepper.node.submit({
              flavor,
              scaling,
              isMonthlyBilled,
              antiAffinity,
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
