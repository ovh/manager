import angular from 'angular';
import '@uirouter/angularjs';

import addModule from './activate.module';

const moduleName = 'webHostingEmailActivateComponent';

angular.module(moduleName, [
  'ui.router',
  addModule,
]);

export default moduleName;
