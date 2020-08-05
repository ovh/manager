import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './edit-description.component';
import routing from './edit-description.routing';

const moduleName = 'ovhCloudConnectEditDescription';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', 'oui'])
  .config(routing)
  .component('cloudConnectEditDescription', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
