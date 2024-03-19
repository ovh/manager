import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './nodes.routing';
import component from './nodes.component';

const moduleName = 'ovhManagerDedicatedClusterNodes';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .component('clusterNodes', component)
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
