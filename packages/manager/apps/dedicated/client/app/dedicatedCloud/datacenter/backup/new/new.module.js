import angular from 'angular';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './new.component';
import offers from '../components/offers';
import routing from './new.routing';
import termsOfUse from '../components/termsOfUse';

const moduleName = 'ovhManagerDedicatedCloudBackupNewModule';

angular
  .module(moduleName, ['oui', 'ovh-api-services', offers, termsOfUse])
  .config(routing)
  .component('ovhManagerDedicatedCloudBackupNew', component);

export default moduleName;
