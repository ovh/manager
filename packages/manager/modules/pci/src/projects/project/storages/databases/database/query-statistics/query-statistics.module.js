import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import queryStatisticsComponent from './query-statistics.component';
import routing from './query-statistics.routing';

import './index.scss';

const moduleName = 'ovhManagerPciStoragesDatabaseQueryStatistics';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseQueryStatisticsComponent',
    queryStatisticsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
