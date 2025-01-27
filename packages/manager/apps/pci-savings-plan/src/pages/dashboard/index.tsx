import { Title } from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import ConsumptionDatagrid from '@/components/Dashboard/ConsumptionDatagrid/ConsumptionDatagrid';
import Filters from '@/components/Dashboard/Filters/Filters';
import Kpis from '@/components/Dashboard/Kpis/Kpis';
import TabsDashboard from '@/components/Dashboard/TabsDashboard/TabsDashboard';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import { useSavingsPlanConsumption } from '@/hooks/useSavingsPlanConsumption';
import { getBigestActiveSavingsPlan } from '@/utils/savingsPlan';

const Dashboard: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: savingsPlan, isLoading, isPending } = useSavingsPlan();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { data: consumption } = useSavingsPlanConsumption();
  const { t } = useTranslation(['dashboard']);

  useEffect(() => {
    if (!isLoading && !isPending && savingsPlan?.length === 0) {
      navigate(`/pci/projects/${projectId}/savings-plan/onboarding`);
    }
  }, [isLoading, isPending, savingsPlan]);

  const currentPlan = getBigestActiveSavingsPlan(savingsPlan);

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
      <Filters
        defaultFilter={currentPlan}
        savingsPlan={savingsPlan}
        locale={locale}
        isLoading={isLoading}
      />
      <Kpis isLoading={isLoading} />
      <ConsumptionDatagrid isLoading={isLoading} />
    </>
  );
};

export default Dashboard;
