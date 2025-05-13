import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import { editServiceName } from '@ovh-ux/manager-components';
import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixGeneralInfoEditDisplayName';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngUiRouterBreadcrumb',
    'ui.router',
    editServiceName,
  ])
  .config(routing)
  .component('nutanixGeneralInfoEditDisplayNameComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
