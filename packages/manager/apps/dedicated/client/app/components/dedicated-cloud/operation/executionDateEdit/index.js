import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-operation-executionDateEdit.component';

const moduleName = 'ovhManagerPccOperationExecutionDateEdit';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPccOperationExecutionDateEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
