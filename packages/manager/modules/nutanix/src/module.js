import angular from 'angular';
import 'angular-ui-bootstrap';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './routing';

const moduleName = 'ovhManagerNutanix';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngTranslateAsyncLoader',
    'oui',
    'ui.bootstrap',
    ngOvhUtils,
    ngUiRouterBreadcrumb,
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
