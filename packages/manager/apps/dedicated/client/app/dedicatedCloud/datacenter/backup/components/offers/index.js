import angular from 'angular';

import component from './component';
import price from '../price';
import './styles.less';

const moduleName = 'ovhManagerDedicatedCloudBackupOffers';

angular
  .module(moduleName, [price])
  .component('dedicatedCloudDatacenterBackupOffers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
