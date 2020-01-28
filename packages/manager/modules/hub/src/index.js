import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

const moduleName = 'ovhManagerHub';

angular.module(moduleName, [
  'ovhManagerCore',
  'pascalprecht.translate',
  'ui.router',
]);

export default moduleName;
