import networkOnboardingComponent from '../../../../components/dedicated-cloud/datacenter/network/onboarding';
import routing from './dedicatedCloud-datacenter-network-onboarding.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkOnboardingModule';

angular.module(moduleName, [networkOnboardingComponent]).config(routing);

export default moduleName;
