import angular from 'angular';

import access from './access';
import modem from './modem';
import resiliation from './resiliation';
import tasks from './tasks';
import missingRio from './missingRio';

import component from './pack-xdsl.component';
import routing from './pack-xdsl.routing';
import service from './xdsl-task-poller.service';

const moduleName = 'ovhManagerTelecomPackXdsl';

angular
  .module(moduleName, [access, missingRio, modem, resiliation, tasks])
  .component('packXdsl', component)
  .service('XdslTaskPoller', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
