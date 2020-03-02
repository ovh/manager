import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-translate';

import component from './new.component';
import offers from '../components/offers';
import offerDetails from '../components/offer-details';
import routing from './new.routing';
import termsOfUse from '../components/termsOfUse';

const moduleName = 'ovhManagerDedicatedCloudBackupNewModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    offers,
    offerDetails,
    termsOfUse,
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackupNew', component);

export default moduleName;
