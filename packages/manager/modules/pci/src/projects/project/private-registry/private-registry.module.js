import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import routing from './private-registry.routing';
import pciPrivateRegistryComponent from './private-registry.component';
import pciPrivateRegistryService from './private-registry.service';
import priceComponent from './components/price';

import create from './create';
import deleteRegistry from './delete';
import onboarding from './onboarding';
import updateRegistry from './update';
import credentials from './credentials';
import apiUrl from './api-url';
import upgradePlan from './upgrade-plan';

const moduleName = 'ovhManagerPciProjectPrivateRegistry';

angular
  .module(moduleName, [
    apiUrl,
    create,
    credentials,
    deleteRegistry,
    onboarding,
    priceComponent,
    updateRegistry,
    upgradePlan,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciPrivateRegistryComponent', pciPrivateRegistryComponent)
  .service('pciPrivateRegistryService', pciPrivateRegistryService)
  .run(/* @ngTranslationsInject:json ./translations ../../new/description/translations */);

export default moduleName;
