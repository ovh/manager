import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import component from './status.component';
import routing from './routing';

const moduleName = 'ovhManagerHubIncidentStatus';

angular
  .module(moduleName, [uiRouter])
  .config(routing)
  .component('hubIncidentStatus', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
