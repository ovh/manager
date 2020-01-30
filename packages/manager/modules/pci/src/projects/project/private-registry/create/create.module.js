import angular from 'angular';
import 'angular-translate';

import component from './create.component';
import routing from './create.routing';
import planUpgrade from '../components/plan-upgrade';

const moduleName = 'pciProjectPrivateRegistryCreateComponent';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', planUpgrade])
  .config(routing)
  .component('pciProjectPrivateRegistryCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
