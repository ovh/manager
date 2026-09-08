import angular from 'angular';

import component from './component';

const moduleName = 'dbaasLogsLegacyAccessNotice';

angular
  .module(moduleName, [])
  .component('dbaasLogsLegacyAccessNotice', component);

export default moduleName;
