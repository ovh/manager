import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';
import { TClusterCreationForm } from '../useCusterCreationStepper';
import BillingStep from '@/components/create/BillingStep.component';
import Estimation from '@/components/create/Estimation.component';
import { TAGS_BLOB } from '@/constants';

export interface BillingStepProps {
  form: TClusterCreationForm;
  onSubmit: (antiAffinity: boolean, isMonthlyBilled: boolean) => void;
  step: StepState;
}

export function ClusterBillingStep({
  form,
  onSubmit,
  step,
}: Readonly<BillingStepProps>) {
  const { t } = useTranslation('stepper');
  const [antiAffinity, setIsAntiaffinity] = useState(false);
  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);

  return (
    <>
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit(antiAffinity, isMonthlyBilled)}
        >
          {t('common_stepper_submit_button_cluster')}
        </OsdsButton>
      )}
    </>
  );
}
