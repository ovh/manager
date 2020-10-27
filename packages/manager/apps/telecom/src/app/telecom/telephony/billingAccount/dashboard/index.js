import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import pieChartComponent from '../../../../../components/telecom/telephony/group/consumption/pie-chart';

import routing from './dashboard.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountDashboard';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    pieChartComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
