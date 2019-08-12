import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './onboarding.component';
import routing from './onboarding.routing';

import order from './order';

import empty from '../../../../components/project/empty';

const moduleName = 'ovhManagerPciFailoverIpsOnboarding';

angular
  .module(moduleName, [
    empty,
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    order,
  ])
  .config(routing)
  .component('pciProjectFailoverIpsOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
