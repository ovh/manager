import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerBmServerPublicBandwidthTileDefinitionComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverPublicBandwidthTileDefinition', component);

export default moduleName;
