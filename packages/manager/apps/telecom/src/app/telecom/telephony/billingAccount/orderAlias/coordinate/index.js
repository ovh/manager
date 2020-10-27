import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import address from './address';
import identity from './identity';

import component from './coordinate.component';

const moduleName =
  'ovhManagerTelecomTelephonyBillingAccountOrderAliasCoordinate';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    address,
    identity,
  ])
  .component('telecomTelephonyBillingAccountOrderAliasCoordinate', component);

export default moduleName;
