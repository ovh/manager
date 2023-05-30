import angular from 'angular';

import datacenterDrpDeleteComponent from '../../../components/dedicated-cloud/datacenter/drp/summary/delete';
import drp from '../../../components/dedicated-cloud/datacenter/drp';
import routing from './delete-drp.routing';

const moduleName = 'managedBaremetalDeleteDrpModule';

angular.module(moduleName, [drp, datacenterDrpDeleteComponent]).config(routing);

export default moduleName;
