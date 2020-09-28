import interfaceAttach from './attach/interfaces-attach.module';
import interfaceDetach from './detach/interfaces-detach.module';
import interfaceRename from './rename/interfaces-rename.module';
import olaActivation from './ola-activation/ola-activation.module';
import olaTerminate from './ola-terminate/ola-terminate.module';
import olaConfiguration from './ola-configuration/ola-configuration.module';

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
    olaTerminate,
    olaConfiguration,
    'ovh-api-services',
    'ui.router',
  ])
  .component('dedicatedServerInterfaces', component)
  .component('olaStepChecker', stepCheckerComponent)
  .service('DedicatedServerInterfacesService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
