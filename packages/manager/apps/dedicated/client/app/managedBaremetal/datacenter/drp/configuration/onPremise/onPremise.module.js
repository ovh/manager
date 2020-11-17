import angular from 'angular';

import datacenterDrpOnPremiseComponent from '../../../../../components/dedicated-cloud/datacenter/drp/configuration/onPremise';
import onPremisePcc from './onPremisePcc';
import ovhPcc from './ovhPcc';
import routing from './onPremise.routing';

const moduleName = 'managedBaremetalDatacenterDrpOnPremiseModule';

angular
  .module(moduleName, [datacenterDrpOnPremiseComponent, onPremisePcc, ovhPcc])
  .config(routing);

export default moduleName;
