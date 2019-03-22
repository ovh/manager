import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';

import component from './component';

const moduleName = 'ovhManagerPciComponentsRunabovePromiseTastState';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('promiseTaskState', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
