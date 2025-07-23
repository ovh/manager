import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import { billingModule } from '@ovh-ux/manager-billing';

import routing from './resiliate.routing';

const moduleName = 'ovhManagerNutanixDashboardGeneralInfoResiliate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    ovhManagerBillingComponents,
    billingModule,
  ])
  .config(routing);

export default moduleName;
