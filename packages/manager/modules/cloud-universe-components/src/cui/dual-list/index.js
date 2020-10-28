import angular from 'angular';

import component from './component';
import filter from './filter';
import provider from './provider';

import './index.less';

const moduleName = 'cuiDualList';

angular
  .module(moduleName, [])
  .component('cuiDualList', component)
  .filter('dualListFilter', filter)
  .provider('DualListProvider', provider);

export default moduleName;
