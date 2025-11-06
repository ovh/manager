import angular from 'angular';

import onPremiseConfiguration from './configuration/onPremise';
import ovhConfiguration from './configuration/ovh';
import routing from './zerto.routing';
import summary from './summary';

const moduleName = 'managedBaremetalDatacenterZertoModule';

angular
  .module(moduleName, [onPremiseConfiguration, ovhConfiguration, summary])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
