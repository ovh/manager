import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsSelect, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { Title } from '@ovh-ux/manager-react-components';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import { SavingsPlanPlanedChangeStatus } from '@/types';
import useTechnicalInfo from '@/hooks/useCatalogCommercial';
import { InstanceTechnicalName, ResourceType } from '@/types/CreatePlan.type';
import { getInstancesInformation } from '@/utils/savingsPlan';
import ConsumptionDatagrid from '@/components/Dashboard/ConsumptionDatagrid/ConsumptionDatagrid';
import TabsDashboard from '@/components/Dashboard/TabsDashboard/TabsDashboard';
import Filters from '@/components/Dashboard/Filters/Filters';
import Kpis from '@/components/Dashboard/Kpis/Kpis';

const Dashboard: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: savingsPlan, isLoading, isPending } = useSavingsPlan();
  const { t } = useTranslation(['dashboard']);

  useEffect(() => {
    if (!isLoading && !isPending && savingsPlan?.length === 0) {
      navigate(`/pci/projects/${projectId}/savings-plan/onboarding`);
    }
  }, [isLoading, isPending, savingsPlan]);

  const onlyActivePlan = savingsPlan
    ?.filter(
      (plan) =>
        plan.periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE,
    )
    .sort((a, b) => a.size - b.size);

  const currentPlan = onlyActivePlan?.[0];

  if (!currentPlan) {
    return <div>No current plan</div>;
  }

  return (
    <>
      <Title>{t('dashboard')}</Title>
      <OdsText preset="span" className="inline-block mb-4 w-[750px]">
        {t('dashboard_description')}
      </OdsText>
      {projectId && <TabsDashboard projectId={projectId} />}

      <Filters />
      <Kpis />

      <ConsumptionDatagrid />
    </>
  );
};

export default Dashboard;
