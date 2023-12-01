import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './clusters.routing';

const moduleName = 'ovhManagerDedicatedClusters';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations ./server/translations */);

export default moduleName;
