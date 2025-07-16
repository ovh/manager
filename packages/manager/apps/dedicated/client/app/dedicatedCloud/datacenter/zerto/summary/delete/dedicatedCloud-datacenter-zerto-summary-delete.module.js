import angular from 'angular';

import DatacenterZertoDeleteComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/summary/delete';
import routing from './dedicatedCloud-datacenter-zerto-summary-delete.routing';

const moduleName = 'dedicatedCloudDatacenterZertoSummaryDeleteModule';

angular.module(moduleName, [DatacenterZertoDeleteComponent]).config(routing);

export default moduleName;
