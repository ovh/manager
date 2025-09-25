import { DashboardGridLayout } from '@ovh-ux/manager-react-components';
import { BillingInformationsTileStandard } from '@ovh-ux/billing-informations';
import { Outlet } from 'react-router-dom';
import ServiceInformationTile from './ServiceInformationTile.component';
import { useObservabilityService } from '@/data/hooks/useObservability';
import { ObsSettingsOutletContext } from '@/types/ObsSettings.type';
import ContactsTile from './ContactsTile.component';

interface GeneralInformationsTabProps {
  serviceId: string;
  context: ObsSettingsOutletContext;
}

const GeneralInformationsTab = ({
  serviceId,
  context,
}: Readonly<GeneralInformationsTabProps>): JSX.Element => {
  const { data, isLoading } = useObservabilityService(serviceId);

  const contextWithData = {
    ...context,
    service: data,
  };

  return (
    <DashboardGridLayout>
      <ServiceInformationTile
        serviceId={serviceId}
        isLoading={isLoading}
        data={data}
      />

      <BillingInformationsTileStandard resourceName={serviceId} />

      <ContactsTile serviceId={serviceId} />
      <Outlet context={contextWithData} />
    </DashboardGridLayout>
  );
};

export default GeneralInformationsTab;
