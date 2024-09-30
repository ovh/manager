import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { StepState } from '../useStep';
import { VersionSelector } from '@/components/VersionSelector.component';

export interface VersionStepProps {
  onSubmit: (version: string) => void;
  step: StepState;
}

export function VersionStep({ onSubmit, step }: Readonly<VersionStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const { t: tVersion } = useTranslation('versions');
  const [version, setVersion] = useState('');
  return (
    <>
      <div className={clsx(step.isLocked && 'hidden')}>
        <VersionSelector onSelectVersion={setVersion} />
      </div>
      {step.isLocked && version && (
        <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} inline>
          <OsdsText
            className="block w-[20rem]"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tVersion('pci_project_versions_list_version', { version })}
          </OsdsText>
        </OsdsTile>
      )}
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={version ? undefined : true}
          onClick={() => version && onSubmit(version)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
