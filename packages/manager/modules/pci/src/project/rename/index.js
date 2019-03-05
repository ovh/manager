import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';

import directive from './directive';

const moduleName = 'ovhManagerPciProjectRename';

angular
  .module(moduleName, [])
  .directive('cloudProjectRename', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
