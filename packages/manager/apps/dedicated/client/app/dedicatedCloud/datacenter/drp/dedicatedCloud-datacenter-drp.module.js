import angular from 'angular';

import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './dedicatedCloud-datacenter-drp.routing';
import summary from './summary';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDrpModule';

angular
  .module(moduleName, [onPremiseConfiguration, ovhConfiguration, summary])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
