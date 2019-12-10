import angular from 'angular';
import 'angular-translate';

import routing from './activate.routing';
import addComponent from './activate.component';

const moduleName = 'webHostingEmailActivateModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('webHostingEmailActivate', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
