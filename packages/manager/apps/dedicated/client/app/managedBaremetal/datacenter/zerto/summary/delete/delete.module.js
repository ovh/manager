import angular from 'angular';

import DatacenterZertoDeleteComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/summary/delete';
import routing from './delete.routing';

const moduleName = 'managedBaremetalDatacenterZertoSummaryDeleteModule';

angular.module(moduleName, [DatacenterZertoDeleteComponent]).config(routing);

export default moduleName;
