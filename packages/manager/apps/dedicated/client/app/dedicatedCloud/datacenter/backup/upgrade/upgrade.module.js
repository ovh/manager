import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import backupOfferDetails from '../components/offer-details';
import component from './upgrade.component';
import termsOfUse from '../components/termsOfUse';

import routing from './upgrade.routing';

const moduleName = 'ovhManagerDedicatedCloudBackupUpgradeModule';

angular
  .module(moduleName, [
    backupOfferDetails,
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'oui',
    'pascalprecht.translate',
    termsOfUse,
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackupUpgrade', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
