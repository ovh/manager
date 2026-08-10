import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

import { TProject, isDiscoveryProject, useParam, useProject } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getLocalDiskHourlyPrice } from '@/api/data/instance-catalog';
import { NodePoolPrice } from '@/api/data/kubernetes';
import { useInstanceCatalog } from '@/api/hooks/useInstanceCatalog';
import Estimation from '@/components/create/Estimation.component';
import { isMultiDeploymentZones } from '@/helpers';
import { nodesAreAssignedPublicIp } from '@/helpers/node-pool';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import usePublicIpPrice from '@/hooks/usePublicIpPrice';
import useRepricingInstancesAvailable from '@/hooks/useRepricingInstancesAvailable';
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
  region?: string;
  hasPrivateNetwork?: boolean;
}

export function ClusterConfirmationStep({
  onSubmit,
  nodePools,
  plan,
  type,
  codes,
  region,
  hasPrivateNetwork,
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
  const has3AZ = use3AZPlanAvailable();
  const getEstimationPrices = selectEstimationPriceFromPlans(
    tNode,
    getFormattedMonthlyCatalogPrice,
    convertHourlyPriceToMonthly,
  );
  const priceFloatingIp = useFloatingIpsPrice(true, type);
  const publicIpPrice = usePublicIpPrice(region ?? null);
  const hasRepricing = useRepricingInstancesAvailable();
  const { data: instanceCatalog } = useInstanceCatalog(projectId, hasRepricing);
  const nodesUsePublicIp = nodesAreAssignedPublicIp({
    hasRepricing,
    plan,
    hasPrivateNetwork: !!hasPrivateNetwork,
  });

  const estimationPrices = getEstimationPrices(plan, plans, nodePools, {
    showSavingPlan,
    has3AZ,
    priceFloatingIp: priceFloatingIp.price?.month ?? null,
    pricePublicIp: nodesUsePublicIp ? (publicIpPrice.price?.month ?? 0) : null,
    ...(hasRepricing && {
      getLocalStorageMonthlyPrice: (flavorName: string) =>
        convertHourlyPriceToMonthly(
          getLocalDiskHourlyPrice(instanceCatalog, flavorName, region) ?? 0,
        ),
    }),
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
