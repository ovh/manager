import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FlavorSelector, KubeFlavor } from '@ovh-ux/manager-pci-common';
import {
  OsdsText,
  OsdsToggle,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';

import {
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

  step: StepState;
  onNodePoolEnabledChange: Dispatch<SetStateAction<boolean>>;
  nodePoolEnabled: boolean;
  onFlavorChange: Dispatch<SetStateAction<KubeFlavor | null>>;
  flavor: KubeFlavor | null;
}

export function NodeTypeStep({
  projectId,
  region,
  step,
  onFlavorChange,
  onNodePoolEnabledChange,
  nodePoolEnabled,
}: Readonly<NodeTypeStepProps>) {
  const { t: tNodePool } = useTranslation('node-pool');

  return (
    <>
      {nodePoolEnabled && (
        <div className={clsx(step.isLocked && 'hidden')}>
          <FlavorSelector
            projectId={projectId}
            region={region}
            onSelect={onFlavorChange}
          />
        </div>
      )}
    </>
  );
}
