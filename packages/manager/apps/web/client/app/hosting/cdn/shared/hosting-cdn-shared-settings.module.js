import routing from './hosting-cdn-shared-settings.routing';
import service from './hosting-cdn-shared-settings.service';
import component from './hosting-cdn-shared-settings.component';

import sharedAddCacheRule from './add-edit-cache-rule/hosting-shared-add-edit-cache-rule.module';
import sharedLeaveConfirmSettings from './leave-confirm-settings';
import cors from './cors';

const moduleName = 'ovhManagerHostingCdnShared';
angular
  .module(moduleName, [cors, sharedAddCacheRule, sharedLeaveConfirmSettings])
  .component('hostingCdnSharedSettings', component)
  .service('HostingCdnSharedService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
