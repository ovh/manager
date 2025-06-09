import angular from 'angular';

import '@ovh-ux/manager-core';

import logs from './logs';

const moduleName = 'ovhManagerDbaasLogs';

angular.module(moduleName, ['ovhManagerCore', logs]);

export default moduleName;
