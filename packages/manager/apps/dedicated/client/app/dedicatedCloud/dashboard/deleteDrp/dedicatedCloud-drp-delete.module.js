import angular from 'angular';

import datacenterDrpDeleteComponent from '../../../components/dedicated-cloud/datacenter/drp/summary/delete';
import drp from '../../../components/dedicated-cloud/datacenter/drp';
import routing from './dedicatedCloud-drp-delete.routing';

const moduleName = 'dedicatedCloudDeleteDrpModule';

angular.module(moduleName, [drp, datacenterDrpDeleteComponent]).config(routing);

export default moduleName;
