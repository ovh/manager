import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import pieChartComponent from '../../../../../components/telecom/telephony/group/consumption/pie-chart';
import componentModule from '../../component/component.module';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountDashboard';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    ngOvhUtils,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    pieChartComponent,
    componentModule,
    ovhManagerAdvices,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
