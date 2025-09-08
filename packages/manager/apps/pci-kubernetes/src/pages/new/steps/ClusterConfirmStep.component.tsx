import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

import {
  TProject,
  isDiscoveryProject,
  useProject,
} from '@ovh-ux/manager-pci-common';

import { NodePoolPrice } from '@/api/data/kubernetes';
import Estimation from '@/components/create/Estimation.component';

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
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const isDiscovery = isDiscoveryProject(project as TProject);

  return (
    <>
      <Estimation plan={plan} nodePools={nodePools} />
      <OsdsButton
        disabled={isDiscovery || undefined}
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
