import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './onboarding.component';
import routing from './onboarding.routing';

import empty from '../../../../components/project/empty';

const moduleName = 'ovhManagerPciBaremetalOnboarding';

angular
  .module(moduleName, [
    empty,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectBaremetalOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
