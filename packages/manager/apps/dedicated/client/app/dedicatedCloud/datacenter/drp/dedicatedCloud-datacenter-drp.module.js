import angular from 'angular';

import datacenterDrpComponent from '../../../components/dedicated-cloud/datacenter/drp';
import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './dedicatedCloud-datacenter-drp.routing';
import summary from './summary';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDrpModule';

angular
  .module(moduleName, [
    datacenterDrpComponent,
    onPremiseConfiguration,
    ovhConfiguration,
    summary,
  ])
  .config(routing);

export default moduleName;
