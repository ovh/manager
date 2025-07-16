import angular from 'angular';

import DatacenterZertoComponent from '../../../../components/dedicated-cloud/datacenter/zerto';
import routing from './dedicatedCloud-datacenter-zerto-add-site.routing';

const moduleName = 'ovhManagerManagedBaremetalDatacenterZertoAddSiteModule';

angular.module(moduleName, [DatacenterZertoComponent]).config(routing);

export default moduleName;
