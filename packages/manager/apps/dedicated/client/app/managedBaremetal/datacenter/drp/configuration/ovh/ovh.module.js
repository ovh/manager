import angular from 'angular';

import datacenterDrpOvhComponent from '../../../../../components/dedicated-cloud/datacenter/drp/configuration/ovh';
import mainPcc from './mainPcc';
import routing from './ovh.routing';
import secondPcc from './secondPcc';

const moduleName = 'managedBaremetalDatacenterDrpOvhModule';

angular
  .module(moduleName, [datacenterDrpOvhComponent, mainPcc, secondPcc])
  .config(routing);

export default moduleName;
