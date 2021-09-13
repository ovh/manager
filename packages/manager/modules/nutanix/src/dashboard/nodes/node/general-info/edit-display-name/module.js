import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixNodeGeneralInfoEditDisplayName';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngUiRouterBreadcrumb',
    'ui.router',
  ])
  .config(routing)
  .component('nutanixNodeGeneralInfoEditDisplayName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
