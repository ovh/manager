import angular from 'angular';

import datacenterDeleteComponent from '../../../../components/dedicated-cloud/datacenter/delete';
import routing from './dedicatedCloud-datacenter-delete.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDelete';

angular.module(moduleName, [datacenterDeleteComponent]).config(routing);

export default moduleName;
