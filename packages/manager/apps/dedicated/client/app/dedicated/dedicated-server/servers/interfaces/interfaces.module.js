import {
  serverBandwidthTile,
  serverOla,
  serverNetworkInterfaces,
  serverConsumptionTile,
  serverMrtgTile,
} from '@ovh-ux/manager-bm-server-components';

import component from './interfaces.component';
import routing from './interfaces.routing';
import olaActivationRouting from './ola/ola-activation.routing';
import olaConfigurationRouting from './ola/ola-configuration.routing';
import { routing as olaPendingTaskRouting } from './ola/ola-pending-task.routing';
import olaResetRouting from './ola/ola-reset.routing';
import interfacesAttachRouting from './attach/interfaces-attach.routing';
import interfacesDetachRouting from './detach/interfaces-detach.routing';
import interfacesRenameRouting from './rename/interfaces-rename.routing';

const moduleName = 'ovhManagerDedicatedServerInterfaces';

angular
  .module(moduleName, [
    'ui.router',
    serverBandwidthTile,
    serverOla,
    serverNetworkInterfaces,
    serverConsumptionTile,
    serverMrtgTile,
  ])
  .component('dedicatedServerInterfaces', component)
  .config(routing)
  // ola routings
  .config(olaActivationRouting)
  .config(olaConfigurationRouting)
  .config(olaPendingTaskRouting)
  .config(olaResetRouting)
  // interfaces network routings
  .config(interfacesAttachRouting)
  .config(interfacesDetachRouting)
  .config(interfacesRenameRouting);

export default moduleName;
