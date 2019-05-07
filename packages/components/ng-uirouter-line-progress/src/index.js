import angular from 'angular';
import '@uirouter/angularjs';

import config from './ng-uirouter-line-progress.config';

import './ng-uirouter-line-progress.less';

const moduleName = 'ngUirouterLineProgress';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .run(config);

export default moduleName;
