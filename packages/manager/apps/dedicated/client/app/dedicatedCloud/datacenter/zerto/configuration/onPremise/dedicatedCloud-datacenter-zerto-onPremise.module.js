import angular from 'angular';

import DatacenterZertoOnPremiseComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/configuration/onPremise';
import onPremisePcc from './onPremisePcc';
import ovhPcc from './ovhPcc';
import routing from './dedicatedCloud-datacenter-zerto-onPremise.routing';

const moduleName = 'dedicatedCloudDatacenterZertoOnPremiseModule';

angular
  .module(moduleName, [DatacenterZertoOnPremiseComponent, onPremisePcc, ovhPcc])
  .config(routing);

export default moduleName;
