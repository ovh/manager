import angular from 'angular';

import '@uirouter/angularjs';

import image from './image';
import chooseSource from './choose-source';
import ovh from './ovh';
import gabarit from './gabarit';
import progress from './progress';

import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerNutanixNodeGeneralInfoServerInstall';

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
  .service('nutanixNodeServerInstall', service);

export default moduleName;
