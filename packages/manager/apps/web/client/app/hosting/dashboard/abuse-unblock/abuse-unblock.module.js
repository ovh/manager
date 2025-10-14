import abuseUnblockComponent from './abuse-unblock.component';
import abuseUnblockRouting from './abuse-unblock.routing';
import service from './abuse-unblock.service';

const moduleName = 'ovhManagerHostingAbuseUnblock';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingAbuseUnblockComponent', abuseUnblockComponent)
  .service('HostingAbuseUnblockService', service)
  .config(abuseUnblockRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
