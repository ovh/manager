import interfaceAttach from './attach/interfaces-attach.module';
import interfaceDetach from './detach/interfaces-detach.module';
import interfaceRename from './rename/interfaces-rename.module';
import olaActivation from './ola-activation/ola-activation.module';
import olaReset from './ola-reset/ola-reset.module';
import olaConfiguration from './ola-configuration/ola-configuration.module';
import olaPendingTask from './ola-pending-task/ola-pending-task.module';

import component from './interfaces.component';
import routing from './interfaces.routing';
import service from './interfaces.service';

import stepCheckerComponent from './ola-step-checker/ola-step-checker.component';

const moduleName = 'ovhManagerDedicatedServerInterfaces';

angular
  .module(moduleName, [
    interfaceAttach,
    interfaceDetach,
    interfaceRename,
    olaActivation,
    olaReset,
    olaConfiguration,
    olaPendingTask,
    'ovh-api-services',
    'ui.router',
  ])
  .component('dedicatedServerInterfaces', component)
  .component('olaStepChecker', stepCheckerComponent)
  .service('DedicatedServerInterfacesService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
