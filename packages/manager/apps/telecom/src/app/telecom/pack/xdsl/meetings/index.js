import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './xdsl-meetings.component';
import routing from './xdsl-meetings.routing';

const moduleName = 'ovhManagerTelecomPackXdslMeetings';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packXdslMeetings', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
