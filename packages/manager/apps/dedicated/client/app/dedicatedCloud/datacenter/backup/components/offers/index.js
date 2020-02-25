import angular from 'angular';

import component from './component';
import './styles.less';

const moduleName = 'ovhManagerDedicatedCloudBackupOffers';

angular
  .module(moduleName, [])
  .component('dedicatedCloudDatacenterBackupOffers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
