import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-doc-url';
import '@ovh-ux/ng-ovh-responsive-popover';
import '@uirouter/angularjs';

import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';

import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';
import ovhManagerDashboardChartPie from './dashboard/chart-pie';

import MetricsDashboardCtrl from './dashboard/metrics-dashboard.controller';
import MetricsDetailCtrl from './metrics-detail.controller';
import MetricsHeaderCtrl from './header/metrics-header.controller';
import MetricService from './metrics.service';
import FormatSiFilter from './format-si.filter';
import routing from './routing';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import './dashboard/metrics-dashboard.less';
import './platform/metrics-platform.less';
import './token/metrics-token.less';
import './token/add/metrics-token-add.less';
import './token/preview/metrics-token-preview.less';

const moduleName = 'ovhManagerMetrics';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhDocUrl',
    'ngOvhResponsivePopover',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    ovhManagerDashboardChartPie,
    ovhManagerServerSidebar,
  ])
  .config(routing)
  .config(
    /* @ngInject */ (
      $qProvider,
      ovhDocUrlProvider,
      TranslateServiceProvider,
    ) => {
      ovhDocUrlProvider.setUserLocale(TranslateServiceProvider.getUserLocale());
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .controller('MetricsDashboardCtrl', MetricsDashboardCtrl)
  .controller('MetricsDetailCtrl', MetricsDetailCtrl)
  .controller('MetricsHeaderCtrl', MetricsHeaderCtrl)
  .service('MetricService', MetricService)
  .filter('formatSi', FormatSiFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
