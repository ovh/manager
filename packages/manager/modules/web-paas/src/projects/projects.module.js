import angular from 'angular';
import '@uirouter/angularjs';

import component from './projects.component';
import routing from './projects.routing';
import terminateProject from './terminate';

const moduleName = 'ovhManagerWebPaasProjects';

angular
  .module(moduleName, ['ui.router', terminateProject])
  .config(routing)
  .component('webPaasProjects', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
