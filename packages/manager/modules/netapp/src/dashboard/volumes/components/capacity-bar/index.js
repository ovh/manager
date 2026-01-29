import angular from 'angular';
import component from './component';

import './style.less';

const moduleName = 'ovhManagerCapacityBarModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerCapacityBarComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
