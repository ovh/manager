import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import '@ovh-ux/manager-at-internet-configuration';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-chart.js';
import 'angular-ui-bootstrap';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './logs.scss';

import empty from './empty';
import component from './logs.component';
import constants from './logs-constants';
import logsDetail from './detail/detail.module';
import logsList from './list/list.module';
import logsOnboarding from './onboarding/onboarding.module';
import logsOrder from './order/order.module';
import routing from './logs.routing';
import cuiDualList from '../components/dual-list';

const moduleName = 'ovhManagerDbaasLogsDashboard';

angular
  .module(moduleName, [
    'chart.js',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'ovhManagerAtInternetConfiguration',
    cuiDualList,
    empty,
    logsOrder,
    logsDetail,
    logsList,
    logsOnboarding,
  ])
  .config(routing)
  .config(
    /* @ngInject */ (atInternetConfigurationProvider) => {
      atInternetConfigurationProvider.setReplacementRules([
        {
          pattern: /^dbaas-logs/,
          replacement: 'dbaas::logs',
        },
      ]);
    },
  )
  .constant('LogsConstants', constants)
  .component('dbaasLogs', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
