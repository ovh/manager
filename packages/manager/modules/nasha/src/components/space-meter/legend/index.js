import angular from 'angular';
import 'angular-translate';

import component from './component';

import './index.less';

const moduleName = 'cucCloudSpaceMeterLegend';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('cucSpaceMeterLegend', component);

export default moduleName;
