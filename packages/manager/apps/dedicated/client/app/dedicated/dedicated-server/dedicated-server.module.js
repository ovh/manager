import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import servers from './servers';

import routing from './dedicated-server.routing';

const moduleName = 'ovhManagerDedicatedServer';

angular.module(moduleName, [ngOvhFeatureFlipping, servers]).config(routing);

export default moduleName;
