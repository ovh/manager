import angular from 'angular';

import DatacenterZertoOvhComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/configuration/ovh';
import mainPcc from './mainPcc';
import routing from './dedicatedCloud-datacenter-zerto-ovh.routing';
import secondPcc from './secondPcc';

const moduleName = 'dedicatedCloudDatacenterZertoOvhModule';

angular
  .module(moduleName, [DatacenterZertoOvhComponent, mainPcc, secondPcc])
  .config(routing);

export default moduleName;
