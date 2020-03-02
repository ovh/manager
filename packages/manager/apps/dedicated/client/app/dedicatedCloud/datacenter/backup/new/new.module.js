import angular from 'angular';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './new.component';
import offers from '../components/offers';
import offerDetails from '../components/offer-details';
import routing from './new.routing';
import termsOfUse from '../components/termsOfUse';

const moduleName = 'ovhManagerDedicatedCloudBackupNewModule';

angular
  .module(moduleName, [
    offers,
    offerDetails,
    'oui',
    'ovh-api-services',
    termsOfUse,
  ])
  .config(routing)
  .component('dedicatedCloudDatacenterBackupNew', component);

export default moduleName;
