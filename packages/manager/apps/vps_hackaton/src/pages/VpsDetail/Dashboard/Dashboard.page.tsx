import { useParams } from 'react-router-dom';
import { useVpsDetail } from '@/api/hooks/useVpsDetail';
import { useVpsOptions } from '@/api/hooks/useVpsOptions';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { VpsInfoTile } from './components/VpsInfoTile.component';
import { VpsNetworkTile } from './components/VpsNetworkTile.component';
import { VpsOptionsTile } from './components/VpsOptionsTile.component';
import { VpsSubscriptionTile } from './components/VpsSubscriptionTile.component';
import { VpsQuickActions } from './components/VpsQuickActions.component';
import { ServiceManagement } from './components/ServiceManagement.component';
import {
  selectVpsInfoForView,
  selectVpsNetworkForView,
  selectVpsSubscriptionForView,
} from './view-models/dashboard.view-model';

export const DashboardPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();

  const { data: vps, isLoading } = useVpsDetail(serviceName ?? '');
  const { data: options, isLoading: optionsLoading } = useVpsOptions(
    serviceName ?? '',
  );

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  const vpsInfo = selectVpsInfoForView(vps);
  const vpsNetwork = selectVpsNetworkForView(vps);
  const vpsSubscription = selectVpsSubscriptionForView(vps);

  if (!vpsInfo || !vpsNetwork || !vpsSubscription) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <VpsInfoTile info={vpsInfo} />
        <VpsNetworkTile network={vpsNetwork} />
      </div>

      <div className="space-y-6">
        {!optionsLoading && options && <VpsOptionsTile options={options} />}
        <VpsSubscriptionTile subscription={vpsSubscription} />
        {vps && <VpsQuickActions vps={vps} />}
        {serviceName && <ServiceManagement serviceName={serviceName} />}
      </div>
    </div>
  );
};

export default DashboardPage;
