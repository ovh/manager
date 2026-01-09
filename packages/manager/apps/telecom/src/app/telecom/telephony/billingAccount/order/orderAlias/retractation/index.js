import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './retractation.component';

const moduleName =
  'ovhManagerTelecomTelephonyBillingAccountOrderAliasRetractation';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component(
    'telecomTelephonyBillingAccountOrderAliasNumberChoiceRetractation',
    component,
  );

export default moduleName;
