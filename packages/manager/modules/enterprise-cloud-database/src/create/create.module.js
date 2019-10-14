import angular from 'angular';

import cardComponent from '../card';
import chooseClusterConfigComponent from './choose-cluster-config';
import chooseCommitmentPeriodComponent from './choose-commitment-period';
import chooseDatabaseComponent from './choose-database';
import choosePaymentTypeComponent from './choose-payment-type';
import chooseRegionComponent from './choose-region';
import createComponent from './create.component';
import routing from './create.routing';

const moduleName = 'enterpriseCloudDatabaseCreateModule';

angular
  .module(moduleName, [
    cardComponent,
    chooseClusterConfigComponent,
    chooseCommitmentPeriodComponent,
    chooseDatabaseComponent,
    choosePaymentTypeComponent,
    chooseRegionComponent,
  ])
  .config(routing)
  .component('enterpriseCloudDatabaseCreateComponent', createComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
