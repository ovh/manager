import angular from 'angular';

import component from './component';


const moduleName = 'cuiMessage';

angular
  .module(moduleName, [
  ])
  .component('CuiMessageContainer', component);

export default moduleName;
