import networkComponent from '../../../components/dedicated-cloud/datacenter/network';
import onboardingModule from './onboarding';
import routing from './dedicatedCloud-datacenter-network.routing';
import moveNsxtEdgeModal from './move-nsxt-edge';
import deleteNsxModal from './delete-nsx-modal';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkModule';

angular
  .module(moduleName, [
    networkComponent,
    onboardingModule,
    moveNsxtEdgeModal,
    deleteNsxModal,
  ])
  .config(routing);

export default moduleName;
