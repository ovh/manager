import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import clusters from './clusters';
import cluster from './clusters/cluster';
import servers from './servers';

import routing from './dedicated-server.routing';

const moduleName = 'ovhManagerDedicatedServer';

angular
  .module(moduleName, [ngOvhFeatureFlipping, clusters, cluster, servers])
  .config(routing);

export default moduleName;
