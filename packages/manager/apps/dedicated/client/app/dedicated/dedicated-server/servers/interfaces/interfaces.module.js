import {
  serverBandwidthTile,
  serverOla,
} from '@ovh-ux/manager-bm-server-components';
import interfaceAttach from './attach/interfaces-attach.module';
import interfaceDetach from './detach/interfaces-detach.module';
import interfaceRename from './rename/interfaces-rename.module';

import component from './interfaces.component';
import routing from './interfaces.routing';
import service from './interfaces.service';
import olaActivationRouting from './ola/ola-activation.routing';
import olaConfigurationRouting from './ola/ola-configuration.routing';
import { routing as olaPendingTaskRouting } from './ola/ola-pending-task.routing';
import olaResetRouting from './ola/ola-reset.routing';

const moduleName = 'ovhManagerDedicatedServerInterfaces';

angular
  .module(moduleName, [
    interfaceAttach,
    interfaceDetach,
    interfaceRename,
    'ovh-api-services',
    'ui.router',
    serverBandwidthTile,
    serverOla,
  ])
  .component('dedicatedServerInterfaces', component)
  .service('DedicatedServerInterfacesService', service)
  .config(routing)
  .config(olaActivationRouting)
  .config(olaConfigurationRouting)
  .config(olaPendingTaskRouting)
  .config(olaResetRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
