import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';
import service from './interfaces.service';
import interfaceAttach from './attach/interfaces-attach.module';
import interfaceDetach from './detach/interfaces-detach.module';
import interfaceRename from './rename/interfaces-rename.module';

const moduleName = 'ovhManagerBmServerComponentsNetworkInterfacesComponent';

angular
  .module(moduleName, [
    interfaceAttach,
    interfaceDetach,
    interfaceRename,
    'oui',
    'ui.router',
    'ovh-api-services',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
  ])
  .component('serverNetworkInterfaces', component)
  .service('DedicatedServerInterfacesService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
