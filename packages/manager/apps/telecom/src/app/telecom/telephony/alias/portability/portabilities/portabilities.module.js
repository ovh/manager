import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import attach from './attach/attach.module';
import cancelPortability from './cancel/cancel.module';
import deleteDoc from './delete/delete.module';
import relaunchPortability from './relaunch/relaunch.module';

import component from './portabilities.component';
import routing from './portabilities.routing';
import service from './portabilities.service';

import './portabilities.less';

const moduleName = 'ovhManagerTelecomTelephonyAliasPortabilityPortabilities';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    attach,
    cancelPortability,
    deleteDoc,
    relaunchPortability,
  ])
  .config(routing)
  .component('portabilities', component)
  .service('TelephonyPortabilitiesService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
