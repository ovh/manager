import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';
import { VersionSelector } from './VersionSelector.component';
import { UpdatePolicySelector } from './UpdatePolicySelector.component';
import { UpdatePolicy } from '@/types';

export interface VersionStepProps {
  onSubmit: (version: string, policy: string) => void;
  step: StepState;
}

export function VersionAndUpdatePolicyStep({
  onSubmit,
  step,
}: Readonly<VersionStepProps>) {
  const { t } = useTranslation(['stepper', 'versions', 'service']);
  const [version, setVersion] = useState<string | null>(null);
  const [policy, setPolicy] = useState(UpdatePolicy.AlwaysUpdate);
  return (
    <>
      {!step.isLocked && (
        <>
          <VersionSelector
            key={version}
            versionSelected={version}
            onSelectVersion={setVersion}
          />
          <UpdatePolicySelector policy={policy} setPolicy={setPolicy} />
        </>
      )}
      {step.isLocked && version && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} inline>
            <OsdsText
              className="block w-[20rem]"
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_project_versions_list_version', {
                version,
                ns: 'versions',
              })}
            </OsdsText>
          </OsdsTile>
          <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} inline>
            <OsdsText
              className="block w-[20rem]"
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(`kube_service_upgrade_policy_${policy}`, {
                ns: 'service',
              })}
            </OsdsText>
          </OsdsTile>
        </div>
      )}
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={version ? undefined : true}
          onClick={() => version && onSubmit(version, policy)}
        >
          {t('common_stepper_next_button_label', { ns: 'stepper' })}
        </OsdsButton>
      )}
    </>
  );
}
