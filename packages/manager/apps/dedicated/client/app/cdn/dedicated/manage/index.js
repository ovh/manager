import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './cdn-dedicated-manage.routes';

import statisticsModule from './statistics';
import logsModule from './logs';
import sslModule from './ssl';
import domainsModule from './domains';

import domainModule from '../domain';

const moduleName = 'cdnDedicatedManage';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    statisticsModule,
    logsModule,
    sslModule,
    domainsModule,
    domainModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
