import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import addObject from './add';
import deleteObject from './delete';

const moduleName = 'ovhManagerPciStoragesContainersContainerObject';

angular
  .module(moduleName, [
    addObject,
    deleteObject,
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
