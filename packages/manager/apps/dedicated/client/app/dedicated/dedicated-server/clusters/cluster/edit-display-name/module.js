import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import { editServiceName } from '@ovh-ux/manager-components';
import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerDedicatedClusterDashboardEditDisplayName';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
    editServiceName,
  ])
  .config(routing)
  .component(
    'managerDedicatedClusterDashboardEditDisplayNameComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
