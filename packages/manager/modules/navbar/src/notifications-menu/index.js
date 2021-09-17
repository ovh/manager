import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/manager-core';

import component from './component';

const moduleName = 'ovhManagerNavbarNotificationsMenu';

angular
  .module(moduleName, ['oui', 'ovh-api-services', 'ovhManagerCore'])
  .component('ovhManagerNavbarNotificationsMenu', component);

export default moduleName;
