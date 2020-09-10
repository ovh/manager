import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import 'angular-translate';

import backupOfferDetails from '../components/offer-details';
import component from './upgrade.component';
import termsOfUse from '../components/termsOfUse';

const moduleName = 'ovhManagerDedicatedCloudBackupUpgradeModule';

angular
  .module(moduleName, [
    backupOfferDetails,
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    termsOfUse,
    'ui.router',
  ])
  .component('dedicatedCloudDatacenterBackupUpgrade', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
