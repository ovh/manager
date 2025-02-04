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

  const isPricingComingSoon = form.flavor?.blobs?.tags?.includes(
    TAGS_BLOB.COMING_SOON,
  );

  const price = useMemo(() => {
    if (form.flavor) {
      return {
        hour: form.flavor.pricingsHourly.price * form.scaling.quantity.desired,
        month:
          form.flavor.pricingsMonthly?.price * form.scaling.quantity.desired,
      };
    }
    return { price: 0, monthyPrice: 0 };
  }, [form.flavor, form.scaling?.quantity.desired]);

  return (
    <>
      {!form.flavor ? (
        <Estimation />
      ) : (
        <BillingStep
          price={price.hour}
          monthlyPrice={price.month}
          antiAffinity={{
            isChecked: antiAffinity,
            isEnabled: !form.scaling?.isAutoscale,
            onChange: setIsAntiaffinity,
          }}
          monthlyBilling={{
            isComingSoon: isPricingComingSoon,
            isChecked: isMonthlyBilled,
            check: setIsMonthlyBilled,
          }}
          warn={form.scaling?.isAutoscale && isMonthlyBilled}
        />
      )}
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
