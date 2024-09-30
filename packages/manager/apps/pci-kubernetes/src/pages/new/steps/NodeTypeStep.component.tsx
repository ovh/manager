import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FlavorSelector, KubeFlavor } from '@ovh-ux/manager-pci-common';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
  const [flavor, setFlavor] = useState<KubeFlavor>();
  return (
    <>
      <p>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tNodePool('kubernetes_add_node_pool_description')}
        </OsdsText>
      </p>
      <div className={clsx(step.isLocked && 'hidden')}>
        <FlavorSelector
          projectId={projectId}
          region={region}
          onSelect={setFlavor}
        />
      </div>
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={flavor ? undefined : true}
          onClick={() => flavor && onSubmit(flavor)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
