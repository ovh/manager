import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';


import routing from './private-registry.routing';
import privateRegistryComponent from './private-registry.component';
import privateRegistryService from './private-registry.service';

import {
  PRIVATE_REGISTRY_STATUS_MAP,
  PRIVATE_REGISTRY_STATUS,
  DELETE_CONFIRMATION_INPUT,
  GUIDES,
} from './private-registry.constants';

import create from './create';
import list from './list';
import deleteRegistry from './delete';
import onboarding from './onboarding';
import updateRegistry from './update';
import credentials from './credentials';
import apiUrl from './api-url';

const moduleName = 'ovhManagerPciProjectPrivateRegistryModule';

angular
  .module(moduleName, [
    list,
    create,
    deleteRegistry,
    onboarding,
    updateRegistry,
    credentials,
    apiUrl,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('privateRegistryComponent', privateRegistryComponent)
  .service('privateRegistryService', privateRegistryService)
  .constant('PRIVATE_REGISTRY_STATUS', PRIVATE_REGISTRY_STATUS)
  .constant('PRIVATE_REGISTRY_STATUS_MAP', PRIVATE_REGISTRY_STATUS_MAP)
  .constant('DELETE_CONFIRMATION_INPUT', DELETE_CONFIRMATION_INPUT)
  .constant('GUIDES', GUIDES)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
