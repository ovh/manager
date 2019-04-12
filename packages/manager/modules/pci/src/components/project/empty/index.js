import angular from 'angular';
import 'angular-translate';

import component from './empty.component';

import './index.less';

const moduleName = 'ovhManagerPciComponentsProjectEmpty';

angular
  .module(moduleName, [
    'pascalprecht.translate',
  ])
  .component('pciProjectEmpty', component);

export default moduleName;
