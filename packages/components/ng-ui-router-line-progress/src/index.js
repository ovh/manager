import angular from 'angular';
import '@uirouter/angularjs';

import config from './ng-ui-router-line-progress.config';

import './ng-ui-router-line-progress.less';

const moduleName = 'ngUiRouterLineProgress';

angular.module(moduleName, ['ui.router']).run(config);

export default moduleName;
