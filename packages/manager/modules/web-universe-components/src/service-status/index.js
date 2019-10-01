import angular from 'angular';
import 'ovh-api-services';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import controller from './service-status-action.controller';
import wucServiceStatusAction from './service-status-action.component';
import SERVICE_STATUS_ACTION from './service-status-action.constant';

const moduleName = 'wucServiceStatusAction';

angular
  .module(moduleName, [
    'ovh-api-services',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
  ])
  .component('wucServiceStatusAction', wucServiceStatusAction)
  .controller('WucServiceStatusActionComponentCtrl', controller)
  .constant('SERVICE_STATUS_ACTION', SERVICE_STATUS_ACTION)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
