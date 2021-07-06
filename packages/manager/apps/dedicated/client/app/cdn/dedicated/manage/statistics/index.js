import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './cdn-dedicated-manage-statistics.routes';

const moduleName = 'cdnDedicatedManageStatistics';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
