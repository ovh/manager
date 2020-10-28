import angular from 'angular';

import access from './access';
import modem from './modem';
import meetings from './meetings';

import component from './pack-xdsl.component';
import routing from './pack-xdsl.routing';
import templates from './pack-xdsl.templates';

const moduleName = 'ovhManagerTelecomPackXdsl';

angular
  .module(moduleName, [access, modem, meetings])
  .component('packXdsl', component)
  .config(routing)
  .run(templates)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
