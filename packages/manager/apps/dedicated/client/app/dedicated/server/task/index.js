import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './dedicated-server-task.component';
import routing from './dedicated-server-task.routing';
import service from './dedicated-server-task.service';

const moduleName = 'ovhManagerDedicatedServerTask';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('dedicatedServerTask', component)
  .config(routing)
  .service('DedicatedServerTask', service)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
