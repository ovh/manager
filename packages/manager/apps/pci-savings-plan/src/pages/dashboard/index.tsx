import { Title, ErrorBanner } from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import ConsumptionDatagrid from '@/components/Dashboard/ConsumptionDatagrid/ConsumptionDatagrid';
import Filters from '@/components/Dashboard/Filters/Filters';
import Kpis from '@/components/Dashboard/Kpis/Kpis';
import TabsDashboard from '@/components/Dashboard/TabsDashboard/TabsDashboard';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import { transformChart } from '@/utils/formatter/formatter';
import GenericChart from '@/components/Chart/Chart';
import { useFilteredConsumption } from '@/hooks/useFilteredConsumption';

const Dashboard: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { t } = useTranslation(['dashboard']);

  const {
    data: savingsPlan,
    isLoading,
    isPending,
    isError,
    error,
  } = useSavingsPlan();

  const {
    flavor,
    period,
    setFlavor,
    setPeriod,
    consumption,
    isConsumptionLoading,
    periodOptions,
    flavorOptions,
  } = useFilteredConsumption(locale);

  const currentConsumption = useMemo(
    () => consumption?.flavors?.find((f) => f.flavor === flavor),
    [consumption, flavor],
  );

  useEffect(() => {
    if (!isLoading && !isPending && savingsPlan?.length === 0) {
      navigate(`/pci/projects/${projectId}/savings-plan/onboarding`);
    }
  }, [isLoading, isPending, savingsPlan]);

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: error.message },
        }}
      />
    );
  }

  const chartData = transformChart(consumption);
  const maxRange = Math.max(...chartData.map((d) => d.inclus + d.exclus));
  const savingsPlanSize = consumption.flavors[0].subscriptions[0].size;

  return (
    <>
      <Title>{t('dashboard')}</Title>
      <OdsText preset="span" className="inline-block mb-4 w-[750px]">
        {t('dashboard_description')}
      </OdsText>
      {projectId && <TabsDashboard projectId={projectId} />}
      <Filters
        locale={locale}
        flavorOptions={flavorOptions}
        isLoading={isConsumptionLoading}
        period={period}
        flavor={flavor}
        setFlavor={setFlavor}
        setPeriod={setPeriod}
        periodOptions={periodOptions}
      />
      <Kpis
        isLoading={isConsumptionLoading}
        consumption={currentConsumption}
        period={period}
      />
      <GenericChart
        chartTitle={'utilisation'}
        chartData={chartData}
        maxRange={maxRange}
        savingsPlanSize={savingsPlanSize}
        serviceFilter="Managed Rancher Services"
      />
      <ConsumptionDatagrid
        isLoading={isConsumptionLoading}
        consumption={currentConsumption}
      />
    </>
  );
};

export default Dashboard;
