import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import { region } from '@ovh-ux/manager-components';
import ovhManagerDashboardChartPie from './chart-pie';

import routing from './dashboard.routing';

import './metrics-dashboard.less';

const moduleName = 'ovhManagerMetricsDashboard';

angular
  .module(moduleName, [
    ngOvhCloudUniverseComponents,
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerDashboardChartPie,
    region,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ../token/translations ../translations */);

export default moduleName;
