import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './hosting-shared-leave-settings.component';
import routing from './hosting-shared-leave-settings.routing';

const moduleName = 'ovhManagerHostingSharedLeaveSettings';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .config(routing)
  .component('managerHostingSharedLeaveSettings', component);

export default moduleName;
