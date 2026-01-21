import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

import { TProject, isDiscoveryProject, useParam, useProject } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { NodePoolPrice } from '@/api/data/kubernetes';
import Estimation from '@/components/create/Estimation.component';
import { isMultiDeploymentZones } from '@/helpers';
import { use3azAvailability } from '@/hooks/useFeatureAvailability';
import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import useSavingPlanAvailable from '@/hooks/useSavingPlanAvailable';
import { DeploymentMode, TClusterPlan } from '@/types';

import usePlanData from '../hooks/usePlanData';
import selectEstimationPriceFromPlans from '../view-models/selectEstimationPriceFromPlans';

export interface BillingStepProps {
  onSubmit: () => void;
  nodePools: NodePoolPrice[];
  plan: TClusterPlan;
  type: DeploymentMode;
  codes: string[];
}

export function ClusterConfirmationStep({
  onSubmit,
  nodePools,
  plan,
  type,
  codes,
}: Readonly<BillingStepProps>) {
  const { t } = useTranslation('stepper');
  const { t: tNode } = useTranslation('node-pool');
  const { projectId } = useParam('projectId');
  const { data: project } = useProject(projectId);
  const isDiscovery = isDiscoveryProject(project as TProject);
  const { plans } = usePlanData(codes, isMultiDeploymentZones(type));

  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(2, {
    exclVat: true,
  });
  const showSavingPlan = useSavingPlanAvailable();
  const { data: has3AZ } = use3azAvailability();
  const getEstimationPrices = selectEstimationPriceFromPlans(
    tNode,
    getFormattedMonthlyCatalogPrice,
    convertHourlyPriceToMonthly,
  );
  const priceFloatingIp = useFloatingIpsPrice(true, type);

  const estimationPrices = getEstimationPrices(plan, plans, nodePools, {
    showSavingPlan,
    has3AZ,
    priceFloatingIp: priceFloatingIp.price?.month ?? null,
  });

  return (
    <div className="max-w-3xl">
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
    </div>
  );
}
