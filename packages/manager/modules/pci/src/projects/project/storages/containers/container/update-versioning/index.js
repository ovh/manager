import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import enableVersioning from './enable';

const moduleName = 'ovhManagerPciStoragesContainersContainerUpdateVersioning';

angular
  .module(moduleName, [
    enableVersioning,

    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
