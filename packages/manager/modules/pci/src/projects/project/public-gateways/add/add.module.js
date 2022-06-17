import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciPublicGatewaysAdd';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('pciProjectPublicGatewaysAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
