import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import clusters from './clusters';
import cluster from './clusters/cluster';
import servers from './servers';
import component from './dedicated-server.component';

import routing from './dedicated-server.routing';

const moduleName = 'ovhManagerDedicatedServer';

angular
  .module(moduleName, [ngOvhFeatureFlipping, clusters, cluster, servers])
  .component('dedicatedServerTabComponent', component)
  .config(routing);

export default moduleName;
