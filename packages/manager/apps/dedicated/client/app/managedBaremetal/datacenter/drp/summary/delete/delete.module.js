import angular from 'angular';

import datacenterDrpDeleteComponent from '../../../../../components/dedicated-cloud/datacenter/drp/summary/delete';
import routing from './delete.routing';

const moduleName = 'managedBaremetalDatacenterDrpSummaryDeleteModule';

angular.module(moduleName, [datacenterDrpDeleteComponent]).config(routing);

export default moduleName;
