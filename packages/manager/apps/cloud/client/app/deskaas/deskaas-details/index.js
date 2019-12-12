import angular from 'angular';
import '@uirouter/angularjs';
import component from './deskaas-details.component';
import routing from './deskaas-details.routing';

const moduleName = 'deskaasDetails';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('deskaasDetailsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
