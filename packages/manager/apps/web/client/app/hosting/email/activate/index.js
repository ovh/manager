import angular from 'angular';
import '@uirouter/angularjs';

import activate from './activate.module';

const moduleName = 'webHostingEmailActivate';

angular.module(moduleName, ['ui.router', activate]);

export default moduleName;
