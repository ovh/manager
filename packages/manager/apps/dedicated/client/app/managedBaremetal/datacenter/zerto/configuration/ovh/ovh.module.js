import angular from 'angular';

import DatacenterZertoOvhComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/configuration/ovh';
import mainPcc from './mainPcc';
import routing from './ovh.routing';
import secondPcc from './secondPcc';

const moduleName = 'managedBaremetalDatacenterZertoOvhModule';

angular
  .module(moduleName, [DatacenterZertoOvhComponent, mainPcc, secondPcc])
  .config(routing);

export default moduleName;
