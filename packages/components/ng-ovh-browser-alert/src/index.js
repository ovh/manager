import angular from 'angular';

import component from './component';
import service from './service';

const moduleName = 'ngOvhBrowserAlert';

angular
  .module(moduleName, [])
  .service('ovhBrowserAlertService', service)
  .component('ovhBrowserAlert', component);

export default moduleName;
