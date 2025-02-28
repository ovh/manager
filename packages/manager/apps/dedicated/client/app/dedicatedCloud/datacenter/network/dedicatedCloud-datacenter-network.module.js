import networkComponent from '../../../components/dedicated-cloud/datacenter/network';
import onboardingModule from './onboarding';
import routing from './dedicatedCloud-datacenter-network.routing';
import moveNsxtEdgeModal from './move-nsxt-edge';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkModule';

angular
  .module(moduleName, [networkComponent, onboardingModule, moveNsxtEdgeModal])
  .config(routing);

export default moduleName;
