import angular from 'angular';

import './index.less';

import component from './component';

const moduleName = 'cuiAdvancedOptions';

angular
  .module(moduleName, [])
  .component('cuiAdvancedOptions', component);

export default moduleName;
