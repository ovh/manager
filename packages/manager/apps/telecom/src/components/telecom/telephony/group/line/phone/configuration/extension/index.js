import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './extension.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupLinePhoneConfigurationExtension';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('linePhoneConfigurationExtension', component);

export default moduleName;
