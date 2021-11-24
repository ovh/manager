import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import chartjs from 'angular-chart.js';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import routing from './cdn-dedicated.routes';
import service from './cdn-dedicated.service';

import manageModule from './manage';
import backendOrderModule from './backend/order';
import quotaOrderModule from './quota/order';

const moduleName = 'ovhManagerCdnDedicated';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    chartjs,
    ngOvhUtils,
    manageModule,
    backendOrderModule,
    quotaOrderModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('Cdn', service);

export default moduleName;
