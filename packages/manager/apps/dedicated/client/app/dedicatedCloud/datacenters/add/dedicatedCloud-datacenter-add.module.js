import angular from 'angular';

import datacenterAddComponent from '../../../components/dedicated-cloud/datacenter/add';
import routing from './dedicatedCloud-datacenter-add.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacentersAdd';

angular.module(moduleName, [datacenterAddComponent]).config(routing);

export default moduleName;
