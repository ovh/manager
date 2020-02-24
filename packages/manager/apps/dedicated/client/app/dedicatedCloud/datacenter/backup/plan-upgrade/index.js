import angular from 'angular';

import component from './component';
import './styles.less';

const moduleName = 'ovhManagerDedicatedCloudBackupPlanUpgrade';

angular
  .module(moduleName, [])
  .component('dedicatedCloudBackupPlanUpgrade', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
