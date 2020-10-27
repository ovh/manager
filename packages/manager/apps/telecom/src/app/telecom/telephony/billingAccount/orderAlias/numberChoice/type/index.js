import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './type.component';

const moduleName =
  'ovhManagerTelecomTelephonyBillingAccountOrderAliasNumberChoiceType';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component(
    'telecomTelephonyBillingAccountOrderAliasNumberChoiceType',
    component,
  );

export default moduleName;
