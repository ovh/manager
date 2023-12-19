import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-filters';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/ng-at-internet';

import '@ovh-ux/manager-advices';
import '@ovh-ux/manager-billing-components';
import component from './component';
import routing from './routing';
import { inlinePropertyEditor } from '@ovh-ux/manager-components';

import OvhManagerNetAppDashboardIndex from './service';
const moduleName = 'ovhManagerNetAppDashboardIndex';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ovhManagerBilling',
    'ovhManagerCore',
    'ovhManagerFilters',
    'ovhManagerAdvices',
    'ngAtInternet',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhUtils',
    inlinePropertyEditor,
  ])
  .service('OvhManagerNetAppDashboardIndex', OvhManagerNetAppDashboardIndex)
  .config(routing)
  .component('ovhManagerNetAppDashboardIndex', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
