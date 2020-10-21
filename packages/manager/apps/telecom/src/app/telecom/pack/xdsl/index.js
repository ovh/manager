import angular from 'angular';

import access from './access';
import modem from './modem';
import meetings from './meetings';
import resiliation from './resiliation';
import orderFollowUp from './orderFollowUp';
import tasks from './tasks';

import component from './pack-xdsl.component';
import routing from './pack-xdsl.routing';
import templates from './pack-xdsl.templates';

const moduleName = 'ovhManagerTelecomPackXdsl';

angular
  .module(moduleName, [
    access,
    modem,
    meetings,
    resiliation,
    tasks,
    orderFollowUp,
  ])
  .component('packXdsl', component)
  .config(routing)
  .run(templates)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
