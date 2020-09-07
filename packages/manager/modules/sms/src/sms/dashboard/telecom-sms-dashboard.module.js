import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-dashboard.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsDashboardModule';

angular
  .module(moduleName, ['ui.router'])
  .component(component.name, component)
  .config(routing);

export default moduleName;
