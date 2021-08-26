import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import component from './component';
import routing from './routing';
import ipmi from './ipmi';

const moduleName = 'ovhManagerNutanixNode';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ui.router',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'oui',
    ngOvhUtils,
    ngUiRouterBreadcrumb,
    ipmi,
  ])
  .config(routing)
  .component('nutanixNode', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
