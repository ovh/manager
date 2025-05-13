import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import Estimation from '@/components/create/Estimation.component';
import { NodePoolPrice } from '@/api/data/kubernetes';
import { TClusterCreationForm } from '../useCusterCreationStepper';

export interface BillingStepProps {
  onSubmit: () => void;
  nodePools: NodePoolPrice[];
  plan: TClusterCreationForm['plan'];
}

export function ClusterConfirmationStep({
  onSubmit,
  nodePools,
  plan,
}: Readonly<BillingStepProps>) {
  const { t } = useTranslation('stepper');

  return (
    <>
      <Estimation plan={plan} nodePools={nodePools} />
      <OsdsButton
        className="mt-4 w-fit"
        size={ODS_BUTTON_SIZE.md}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onSubmit}
      >
        {t('common_stepper_submit_button_cluster')}
      </OsdsButton>
    </>
  );
}
