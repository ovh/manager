import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  isDiscoveryProject,
  TProject,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { OsdsButton } from '@ovhcloud/ods-components/react';

import {
  convertHourlyPriceToMonthly,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { NodePoolPrice } from '@/api/data/kubernetes';
import Estimation from '@/components/create/Estimation.component';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useSavingPlanAvailable from '@/hooks/useSavingPlanAvailable';
import { TClusterPlan } from '@/types';

import usePlanData from '../hooks/usePlanData';
import selectEstimationPriceFromPlans from '../view-models/selectEstimationPriceFromPlans';

export interface BillingStepProps {
  onSubmit: () => void;
  nodePools: NodePoolPrice[];
  plan: TClusterPlan;
}

export function ClusterConfirmationStep({
  onSubmit,
  nodePools,
  plan,
}: Readonly<BillingStepProps>) {
  const { t } = useTranslation('stepper');
  const { t: tNode } = useTranslation('node-pool');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const isDiscovery = isDiscoveryProject(project as TProject);
  const { plans } = usePlanData();
  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(2, {
    exclVat: true,
  });
  const showSavingPlan = useSavingPlanAvailable();
  const has3AZ = use3AZPlanAvailable();
  const getEstimationPrices = selectEstimationPriceFromPlans(
    tNode,
    getFormattedMonthlyCatalogPrice,
    convertHourlyPriceToMonthly,
  );

  const estimationPrices = getEstimationPrices(plan, plans, nodePools, {
    showSavingPlan,
    has3AZ,
  });

  return (
    <>
      {estimationPrices && <Estimation rows={estimationPrices} />}
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
