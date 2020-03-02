import angular from 'angular';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './component';
import offerDetails from '../offer-details';
import './styles.less';

const moduleName = 'ovhManagerDedicatedCloudBackupOffers';

angular
  .module(moduleName, [offerDetails, ovhManagerCatalogPrice])
  .component('dedicatedCloudDatacenterBackupOffers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
