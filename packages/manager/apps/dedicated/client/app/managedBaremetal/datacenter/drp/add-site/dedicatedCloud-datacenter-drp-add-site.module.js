import angular from 'angular';

import datacenterDrpComponent from '../../../../components/dedicated-cloud/datacenter/drp';
import routing from './dedicatedCloud-datacenter-drp-add-site.routing';

const moduleName = 'ovhManagerManagedBaremetalDatacenterDrpAddSiteModule';

angular.module(moduleName, [datacenterDrpComponent]).config(routing);

export default moduleName;
