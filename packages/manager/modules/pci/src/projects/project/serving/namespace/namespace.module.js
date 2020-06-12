import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import infos from './infos';
import models from './models';
import tokens from './tokens';
import component from './namespace.component';
import routing from './namespace.routing';

const moduleName = 'ovhManagerPciServingNamespace';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    infos,
    models,
    tokens,
  ])
  .config(routing)
  .component('pciProjectServingNamespace', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
