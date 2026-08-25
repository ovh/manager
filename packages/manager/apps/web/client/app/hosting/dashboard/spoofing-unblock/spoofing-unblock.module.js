import spoofingUnblockComponent from './spoofing-unblock.component';
import spoofingUnblockRouting from './spoofing-unblock.routing';
import service from './spoofing-unblock.service';

const moduleName = 'ovhManagerHostingSpoofingUnblock';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingSpoofingUnblockComponent', spoofingUnblockComponent)
  .service('HostingSpoofingUnblockService', service)
  .config(spoofingUnblockRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
