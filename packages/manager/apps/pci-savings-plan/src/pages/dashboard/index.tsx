import { ErrorBanner } from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText, OdsMessage } from '@ovhcloud/ods-components/react';
import ConsumptionDatagrid from '@/components/Dashboard/ConsumptionDatagrid/ConsumptionDatagrid';
import Filters from '@/components/Dashboard/Filters/Filters';
import Kpis from '@/components/Dashboard/Kpis/Kpis';
import TabsDashboard from '@/components/Dashboard/TabsDashboard/TabsDashboard';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import GenericChart from '@/components/Chart/Chart';
import { useFilteredConsumption } from '@/hooks/useFilteredConsumption';
import Header from '@/components/Header/Header';
import { useProjectId } from '@/hooks/useProject';
import { isInstanceFlavor } from '@/utils/savingsPlan';

const Dashboard: React.FC = () => {
  const projectId = useProjectId();
  const navigate = useNavigate();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { t } = useTranslation(['dashboard', 'listing']);

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
  const isInstance = useMemo(() => isInstanceFlavor(flavor), [flavor]);

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

  return (
    <>
      <Header title={t('listing:title')} />

      <OdsText preset="span" className="inline-block mb-4 w-[750px]">
        {t('dashboard_description')}
      </OdsText>
      {projectId && <TabsDashboard projectId={projectId} />}
      {!isConsumptionLoading && flavorOptions.length === 0 && (
        <OdsMessage
          color="information"
          className="inline-block mb-4 w-[750px]"
          isDismissible={false}
        >
          {t('dashboard_banner_no_savings_plan')}
        </OdsMessage>
      )}
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
        flavorOptions={flavorOptions}
        isLoading={isConsumptionLoading}
        consumption={currentConsumption}
        period={period}
      />
      {currentConsumption && (
        <GenericChart
          flavor={flavor}
          consumption={currentConsumption}
          chartTitle={t('dashboard_graph_title')}
        />
      )}
      <ConsumptionDatagrid
        isInstanceFlavor={isInstance}
        isLoading={isConsumptionLoading}
        consumption={currentConsumption}
      />
    </>
  );
};

export default Dashboard;
