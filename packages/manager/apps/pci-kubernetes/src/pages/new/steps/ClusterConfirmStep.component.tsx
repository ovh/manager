import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';
import { TClusterCreationForm } from '../useCusterCreationStepper';

import Estimation from '@/components/create/Estimation.component';

export interface BillingStepProps {
  form: TClusterCreationForm;
  onSubmit: () => void;
  step: StepState;
}

export function ClusterConfirmationStep({
  form,
  onSubmit,
  step,
}: Readonly<BillingStepProps>) {
  const { t } = useTranslation('stepper');

  return (
    <>
      {!step.isLocked && (
        <>
          {!form.flavor && <Estimation />}
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            className="block"
          ></OsdsText>
          <OsdsButton
            className="mt-4 w-fit"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => onSubmit()}
          >
            {t('common_stepper_submit_button_cluster')}
          </OsdsButton>
        </>
      )}
    </>
  );
}
