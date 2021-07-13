import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerBmServerComponentsNetbootComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
  ])
  .component('serverNetboot', component)
  .service('netbootService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
