import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import deleteContainer from './delete';
import addUser from './addUser';
import object from './object';
import component from './container.component';
import emptyUser from './emptyUser';
import updateVersioning from './update-versioning';

const moduleName = 'ovhManagerPciStoragesContainersContainer';

angular
  .module(moduleName, [
    deleteContainer,
    emptyUser,
    addUser,
    object,
    updateVersioning,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    OnboardingLayoutHelper,
  ])
  .component('pciProjectStorageContainersContainer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
