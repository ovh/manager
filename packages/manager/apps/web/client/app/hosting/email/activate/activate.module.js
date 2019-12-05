import angular from 'angular';

import routing from './activate.routing';
import addComponent from './activate.component';

const moduleName = 'webHostingEmailActivateModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('webHostingEmailActivateComponent', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
