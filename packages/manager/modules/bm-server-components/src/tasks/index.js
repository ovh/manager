import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import service from '../server/server.service';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsTasksComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
  ])
  .service('Server', service)
  .component('serverTasks', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
