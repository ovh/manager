import angular from 'angular';
import '@uirouter/angularjs';

import component from './projects.component';
import routing from './projects.routing';
import terminateProject from './terminate';
import status from '../components/status';

const moduleName = 'ovhManagerWebPaasProjects';

angular
  .module(moduleName, ['ui.router', terminateProject, status])
  .config(routing)
  .component('webPaasProjects', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
