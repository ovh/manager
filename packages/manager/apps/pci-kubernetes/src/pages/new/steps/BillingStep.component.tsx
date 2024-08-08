import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';
import BillingAndAntiAffinityStep from '@/components/create/BillingAndAntiAffinityStep.component';
import { TClusterCreationForm } from '../useCusterCreationStepper';

export interface BillingStepProps {
  form: TClusterCreationForm;
  onSubmit: (autoscale: boolean) => void;
  step: StepState;
}

// @TODO pass prices (flavor, gateway, floating ip) to BillingAndAntiAffinityStep component
// @TODO pass form.isMonthlyBilled to BillingAndAntiAffinityStep component
export function BillingStep({
  form,
  onSubmit,
  step,
}: Readonly<BillingStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [isAutoscale, setIsAutoscale] = useState(false);
  return (
    <>
      <BillingAndAntiAffinityStep
        isChecked={isAutoscale}
        maxNodes={form.scaling?.quantity?.max || 100}
        onChange={() => {
          // @TODO set autoscale, set monthly billed
        }}
      />
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit(isAutoscale)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
