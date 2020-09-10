import angular from 'angular';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import 'angular-translate';

import './backup.less';

import backupOfferDetails from './components/offer-details';
import backupOffers from './components/offers';
import backupService from './backup.service';
import component from './backup.component';

const moduleName = 'ovhManagerDedicatedCloudBackupModule';

angular
  .module(moduleName, [
    'ngOvhSwimmingPoll',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    backupOfferDetails,
    backupOffers,
  ])
  .component('dedicatedCloudDatacenterBackup', component)
  .service('dedicatedCloudDatacenterBackupService', backupService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
