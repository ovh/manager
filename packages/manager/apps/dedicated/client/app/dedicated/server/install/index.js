import angular from 'angular';

import '@uirouter/angularjs';

import image from './image';
import chooseSource from './choose-source';
import ovh from './ovh';
import gabarit from './gabarit';
import progress from './progress';

import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerDedicatedServerInstall';

angular
  .module(moduleName, [
    'ui.router',
    image,
    chooseSource,
    ovh,
    gabarit,
    progress,
  ])
  .config(routing)
  .service('dedicatedServerInstall', service);

export default moduleName;
