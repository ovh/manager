import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './clusters.routing';
import component from './clusters.component';

const moduleName = 'ovhManagerDedicatedClusters';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .component('clustersListing', component)
  .config(routing)
  .run(/* @ngTranslationsInject ./translations ./server/translations */);

export default moduleName;
