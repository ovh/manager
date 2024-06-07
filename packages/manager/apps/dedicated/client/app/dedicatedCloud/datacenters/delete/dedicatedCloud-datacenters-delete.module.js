import angular from 'angular';

import datacenterDeleteComponent from '../../../components/dedicated-cloud/datacenter/delete';

import routing from './dedicatedCloud-datacenters-delete.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacentersDelete';

angular.module(moduleName, [datacenterDeleteComponent]).config(routing);

export default moduleName;
