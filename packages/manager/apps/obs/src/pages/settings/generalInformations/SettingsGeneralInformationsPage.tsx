import { useOutletContext, useParams } from 'react-router-dom';
import GeneralInformationsTab from './GeneralInformationsTab';
import { ObsSettingsOutletContext } from '@/types/ObsSettings.type';

const SettingsGeneralInformationsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const context = useOutletContext<ObsSettingsOutletContext>();

  if (!serviceId) {
    return <div>Invalid or missing service</div>;
  }

  return <GeneralInformationsTab serviceId={serviceId} context={context} />;
};

export default SettingsGeneralInformationsPage;
