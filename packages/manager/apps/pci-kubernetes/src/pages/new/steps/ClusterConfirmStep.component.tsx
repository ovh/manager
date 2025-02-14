import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
          <Estimation nodePools={form.nodePools} />
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
