import angular from 'angular';

import datacenterDrpOvhComponent from '../../../../../components/dedicated-cloud/datacenter/drp/configuration/ovh';
import mainPcc from './mainPcc';
import routing from './dedicatedCloud-datacenter-drp-ovh.routing';
import secondPcc from './secondPcc';

const moduleName = 'dedicatedCloudDatacenterDrpOvhModule';

angular
  .module(moduleName, [datacenterDrpOvhComponent, mainPcc, secondPcc])
  .config(routing);

export default moduleName;
