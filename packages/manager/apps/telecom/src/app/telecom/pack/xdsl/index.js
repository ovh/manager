import angular from 'angular';

import access from './access';
import modem from './modem';
import meetings from './meetings';
import resiliation from './resiliation';
import orderFollowUp from './orderFollowUp';
import tasks from './tasks';
import missingRio from './missingRio';

import component from './pack-xdsl.component';
import routing from './pack-xdsl.routing';

const moduleName = 'ovhManagerTelecomPackXdsl';

angular
  .module(moduleName, [
    access,
    modem,
    meetings,
    resiliation,
    tasks,
    orderFollowUp,
    missingRio,
  ])
  .component('packXdsl', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
