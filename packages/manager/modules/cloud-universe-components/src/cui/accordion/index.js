import angular from 'angular';

import './index.less';

import directive from './directive';
import listComponent from './list';

const moduleName = 'cuiAccordion';

angular
  .module(moduleName, [listComponent])
  .directive('cuiAccordion', directive);

export default moduleName;
