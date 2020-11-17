import angular from 'angular';

import datacenterDrpOvhSecondPccComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/ovh/secondPcc';
import routing from './secondPccStep.routing';

const moduleName = 'managedBaremetalDatacenterDrpOvhSecondPccStepModule';

angular
  .module(moduleName, [datacenterDrpOvhSecondPccComponent])
  .config(routing);

export default moduleName;
