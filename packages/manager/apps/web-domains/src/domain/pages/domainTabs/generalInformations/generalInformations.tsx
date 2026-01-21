import { useParams } from 'react-router-dom';
import BannerStatus from '@/domain/components/BannerStatus/BannerStatus';
import GeneralInformationsCards from '@/domain/components/InformationsCards/GeneralInformations';
import SubscriptionCards from '@/domain/components/SubscriptionCards/SubscriptionCards';
import AssociatedServicesCards from '@/domain/components/AssociatedServicesCards/AssociatedServicesCards';
import ConfigurationCards from '@/domain/components/ConfigurationCards/ConfigurationCards';

export default function GeneralInformations() {
  const { serviceName } = useParams<{ serviceName: string }>();

  return (
    <div className="flex flex-col min-h-0">
      <BannerStatus serviceName={serviceName} />
      <div className="grid grid-cols-1 gap-6 flex-1 min-h-0 lg:!grid-cols-3">
        <div className="flex flex-col gap-6">
          <GeneralInformationsCards serviceName={serviceName} />
          <AssociatedServicesCards serviceName={serviceName} />
        </div>
        <ConfigurationCards serviceName={serviceName} />
        <SubscriptionCards serviceName={serviceName} />
      </div>
    </div>
  );
}
