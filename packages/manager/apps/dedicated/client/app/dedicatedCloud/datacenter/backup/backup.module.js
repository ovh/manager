import angular from 'angular';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import './backup.less';

import backupDelete from './delete';
import backupNew from './new';
import backupOfferDetails from './components/offer-details';
import backupOffers from './components/offers';
import backupService from './backup.service';
import backupUpgrade from './upgrade';
import component from './backup.component';
import minimumHosts from './minimumHosts';
import routing from './backup.routing';
import splaLicence from './splaLicence';

const moduleName = 'ovhManagerDedicatedCloudBackupModule';

angular
  .module(moduleName, [
    'ngOvhSwimmingPoll',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    backupDelete,
    backupOfferDetails,
    backupOffers,
    backupNew,
    backupUpgrade,
    minimumHosts,
    splaLicence,
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackup', component)
  .service('dedicatedCloudDatacenterBackupService', backupService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
