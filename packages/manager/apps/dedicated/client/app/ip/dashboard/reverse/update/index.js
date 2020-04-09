import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './update.component';
import routing from './update.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardReverseUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardReverseUpdate', component)
  .config(routing);

export default moduleName;
