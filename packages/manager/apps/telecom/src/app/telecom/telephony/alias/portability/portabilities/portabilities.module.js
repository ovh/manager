import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import attach from './attach/attach.module';
import deleteDoc from './delete/delete.module';

import component from './portabilities.component';
import routing from './portabilities.routing';

import './portabilities.less';

const moduleName = 'ovhManagerTelecomTelephonyAliasPortabilityPortabilities';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    attach,
    deleteDoc,
  ])
  .config(routing)
  .component('portabilities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
