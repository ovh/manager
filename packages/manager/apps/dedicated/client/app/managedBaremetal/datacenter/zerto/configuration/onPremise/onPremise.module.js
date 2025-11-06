import angular from 'angular';

import DatacenterZertoOnPremiseComponent from '../../../../../components/dedicated-cloud/datacenter/zerto/configuration/onPremise';
import onPremisePcc from './onPremisePcc';
import ovhPcc from './ovhPcc';
import routing from './onPremise.routing';

const moduleName = 'managedBaremetalDatacenterZertoOnPremiseModule';

angular
  .module(moduleName, [DatacenterZertoOnPremiseComponent, onPremisePcc, ovhPcc])
  .config(routing);

export default moduleName;
