import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TLocalisation } from '@ovh-ux/manager-pci-common';
import {
  OsdsButton,
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { KubeRegionSelector } from '@/components/region-selector/KubeRegionSelector.component';
import { StepState } from '../useStep';

export interface LocationStepProps {
  projectId: string;
  onSubmit: (region: TLocalisation) => void;
  step: StepState;
}

export function LocationStep({
  projectId,
  onSubmit,
  step,
}: Readonly<LocationStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [region, setRegion] = useState<TLocalisation>();
  return (
    <>
      <div className={clsx(step.isLocked && 'hidden')}>
        <KubeRegionSelector projectId={projectId} onSelectRegion={setRegion} />
      </div>
      {step.isLocked && region && (
        <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} inline>
          <OsdsText
            className="block w-[20rem]"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {region.macroLabel}
          </OsdsText>
          <OsdsDivider separator />
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {region.microLabel}
          </OsdsText>
        </OsdsTile>
      )}
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={region ? undefined : true}
          onClick={() => region && onSubmit(region)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
