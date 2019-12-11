import angular from 'angular';

import './index.less';

import component from './component';

const moduleName = 'cuiAccordionList';

angular
  .module(moduleName, [])
  .component('cuiAccordionList', component);

export default moduleName;
