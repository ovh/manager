import angular from 'angular';

import atInternet from './at-internet';
import betaWarning from './beta-warning';
import managerPreload from './manager-preload';
import otrs from './otrs';

const moduleName = 'publicCloudComponents';

angular
  .module(moduleName, [
    atInternet,
    betaWarning,
    managerPreload,
    otrs,
  ]);

export default moduleName;
