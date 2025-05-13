import angular from 'angular';

// Peer dependencies.
import '@ovh-ux/ng-ovh-telecom-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

// Components.
import component from './cdr.component';

const moduleName = 'ovhManagerCarrierSipCdr';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
  ])
  .component('carrierSipCdr', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
