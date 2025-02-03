import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FlavorSelector, KubeFlavor } from '@ovh-ux/manager-pci-common';
import {
  OsdsButton,
  OsdsText,
  OsdsToggle,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';

import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';

export interface NodeTypeStepProps {
  projectId: string;
  region: string;
  onSubmit: (flavor: KubeFlavor) => void;
  step: StepState;
}

export function NodeTypeStep({
  projectId,
  region,
  onSubmit,
  step,
}: Readonly<NodeTypeStepProps>) {
  const { t: tNodePool } = useTranslation('node-pool');
  const { t: tStepper } = useTranslation('stepper');
  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const [flavor, setFlavor] = useState<KubeFlavor | null>(null);

  useEffect(() => {
    if (!nodePoolEnabled) setFlavor(null);
  }, [nodePoolEnabled]);

  const isNodePoolValid = !nodePoolEnabled || !!flavor;

  return (
    <>
      <OsdsFormField className="mt-8" inline>
        <OsdsToggle
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={nodePoolEnabled || undefined}
          onClick={() => setNodePoolEnabled((auto) => !auto)}
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
        <div className={clsx(step.isLocked && 'hidden')}>
          <FlavorSelector
            projectId={projectId}
            region={region}
            onSelect={setFlavor}
          />
        </div>
      )}

      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={isNodePoolValid ? undefined : true}
          onClick={() => isNodePoolValid && onSubmit(flavor)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
