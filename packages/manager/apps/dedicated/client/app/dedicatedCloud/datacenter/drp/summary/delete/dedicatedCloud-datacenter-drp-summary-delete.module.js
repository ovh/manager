import angular from 'angular';

import datacenterDrpDeleteComponent from '../../../../../components/dedicated-cloud/datacenter/drp/summary/delete';
import routing from './dedicatedCloud-datacenter-drp-summary-delete.routing';

const moduleName = 'dedicatedCloudDatacenterDrpSummaryDeleteModule';

angular.module(moduleName, [datacenterDrpDeleteComponent]).config(routing);

export default moduleName;
