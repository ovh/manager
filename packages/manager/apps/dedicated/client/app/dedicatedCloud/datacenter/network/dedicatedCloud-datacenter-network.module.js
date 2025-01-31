import networkComponent from '../../../components/dedicated-cloud/datacenter/network';
import onboardingModule from './onboarding';
import routing from './dedicatedCloud-datacenter-network.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkModule';

angular
  .module(moduleName, [networkComponent, onboardingModule])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
