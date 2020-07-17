import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import containers from '../containers';

import addObject from './add';
import object from './object';
import onboarding from './onboarding';

import routing from './objects.routing';

const moduleName = 'ovhManagerPciStoragesObjects';

angular
  .module(moduleName, [
    addObject,
    containers,
    object,
    onboarding,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
