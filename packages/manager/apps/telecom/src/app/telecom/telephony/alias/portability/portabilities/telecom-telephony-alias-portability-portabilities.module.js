import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import attach from './attach/portabilities-attach.module';

import component from './telecom-telephony-alias-portability-portabilities.component';
import routing from './telecom-telephony-alias-portability-portabilities.routing';
import service from './telecom-telephony-alias-portability-portabilities.service';

const moduleName = 'ovhManagerTelecomPortabilities';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    attach,
  ])
  .config(routing)
  .component('portabilities', component)
  .service('TelephonyPortabilitiesService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
