import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './nodes.routing';

const moduleName = 'ovhManagerDedicatedClusterNodes';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
