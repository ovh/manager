import { Outlet, useParams } from 'react-router-dom';
import { Suspense } from 'react';
import {
  useLoadBalancer,
  useLoadBalancerFlavor,
} from '@/api/hook/useLoadBalancer';
import {
  usePrivateNetworkByRegion,
  useSubnetByNetworkAndRegion,
} from '@/api/hook/useNetwork';
import Configuration from './Configuration';
import GeneralInformation from './GeneralInformation';

export default function Overview() {
  const { projectId, region, loadBalancerId } = useParams();

  const { data: loadBalancer } = useLoadBalancer({
    projectId,
    region,
    loadBalancerId,
  });

  const { data: loadBalancerFlavor } = useLoadBalancerFlavor({
    projectId,
    region,
    flavorId: loadBalancer?.flavorId,
  });

  const { data: network } = usePrivateNetworkByRegion({
    projectId,
    region,
    networkId: loadBalancer?.vipNetworkId,
  });

  const { data: subnet } = useSubnetByNetworkAndRegion({
    projectId,
    region,
    networkId: loadBalancer?.vipNetworkId,
    subnetId: loadBalancer?.vipSubnetId,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
      <GeneralInformation
        loadBalancerName={loadBalancer?.name}
        loadBalancerRegion={loadBalancer?.region}
        loadBalancerCreationDate={loadBalancer?.createdAt}
        loadBalancerId={loadBalancer?.id}
      />
      <Configuration
        loadBalancerProvisioningStatus={loadBalancer?.provisioningStatus}
        loadBalancerOperatingStatus={loadBalancer?.operatingStatus}
        flavorName={loadBalancerFlavor?.name}
        networkName={network?.name}
        subnetCidr={subnet?.cidr}
        loadBalancerVipAddress={loadBalancer?.vipAddress}
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
