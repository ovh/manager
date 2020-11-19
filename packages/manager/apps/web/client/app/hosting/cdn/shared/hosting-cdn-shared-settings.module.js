import routing from './hosting-cdn-shared-settings.routing';
import service from './hosting-cdn-shared-settings.service';
import component from './hosting-cdn-shared-settings.component';
import sharedAddCacheRule from './add-edit-cache-rule/hosting-shared-add-edit-cache-rule.module';
import sharedConfirmSettings from './leave-confirm-settings/confirm/hosting-shared-confirm-settings.module';

const moduleName = 'ovhManagerHostingCdnShared';
angular
  .module(moduleName, [sharedAddCacheRule, sharedConfirmSettings])
  .component('hostingCdnSharedSettings', component)
  .service('HostingCdnSharedService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
