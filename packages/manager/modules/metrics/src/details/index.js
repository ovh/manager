import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-doc-url';
import '@ovh-ux/ng-ovh-responsive-popover';
import '@uirouter/angularjs';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

import dashboard from '../dashboard/dashboard.module';
import token from '../token/token.module';
import platform from '../platform/platform.module';

import MetricService from './metrics.service';
import FormatSiFilter from './format-si.filter';
import routing from './routing';

import '../platform/metrics-platform.less';

const moduleName = 'ovhManagerMetricsDetails';

angular
  .module(moduleName, [
    ngOvhCloudUniverseComponents,
    'ngOvhDocUrl',
    'ngOvhResponsivePopover',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    dashboard,
    token,
    platform,
  ])
  .config(routing)
  .config(
    /* @ngInject */ ($qProvider, coreConfigProvider, ovhDocUrlProvider) => {
      ovhDocUrlProvider.setUserLocale(coreConfigProvider.getUserLocale());
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .service('MetricService', MetricService)
  .filter('formatSi', FormatSiFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
