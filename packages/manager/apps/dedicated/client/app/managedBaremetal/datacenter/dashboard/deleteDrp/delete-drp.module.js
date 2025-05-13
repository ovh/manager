import angular from 'angular';

import datacenterDeleteDrpComponent from '../../../../components/dedicated-cloud/datacenter/drp/summary/delete';
import drp from '../../../../components/dedicated-cloud/datacenter/drp';
import routing from './delete-drp.routes';

const moduleName = 'managedBaremetalDatacenterDeleteDrp';

angular.module(moduleName, [datacenterDeleteDrpComponent, drp]).config(routing);

export default moduleName;
