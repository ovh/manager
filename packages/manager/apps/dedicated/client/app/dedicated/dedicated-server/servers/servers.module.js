import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './servers.component';
import routing from './servers.routing';
import dedicatedCloudService from '../../../components/dedicated-cloud/dedicatedCloud.service';

const moduleName = 'ovhManagerDedicatedServerServers';

angular
  .module(moduleName, [ngOvhFeatureFlipping, dedicatedCloudService])
  .component('dedicatedServerServers', component)
  .config(routing)
  .run(/* @ngTranslationsInject ./translations ./server/translations */);

export default moduleName;
