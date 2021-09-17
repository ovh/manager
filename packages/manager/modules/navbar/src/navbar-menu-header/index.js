import angular from 'angular';

import builder from './builder';

import './index.less';

const moduleName = 'ovhManagerNavbarMenuHeader';

angular
  .module(moduleName, [])
  .service('ovhManagerNavbarMenuHeaderBuilder', builder);

export default moduleName;
