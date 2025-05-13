import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingOutgoingTrafic';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('outgoingTrafic', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
