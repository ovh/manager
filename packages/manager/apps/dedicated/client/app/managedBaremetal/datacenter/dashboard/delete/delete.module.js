import angular from 'angular';

import datacenterDeleteComponent from '../../../../components/dedicated-cloud/datacenter/delete';
import routing from './delete.routes';

const moduleName = 'managedBaremetalDatacenterDelete';

angular.module(moduleName, [datacenterDeleteComponent]).config(routing);

export default moduleName;
