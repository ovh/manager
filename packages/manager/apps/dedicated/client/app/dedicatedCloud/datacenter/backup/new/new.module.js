import angular from 'angular';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './new.component';
import offers from '../components/offers';
import routing from './new.routing';
import backupLegacy from '../legacy';
import termsOfUse from '../components/termsOfUse';

const moduleName = 'ovhManagerDedicatedCloudBackupNewModule';

angular
  .module(moduleName, [
    'ngOvhPaymentMethod',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    backupLegacy,
    offers,
    termsOfUse,
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackupNew', component);

export default moduleName;
