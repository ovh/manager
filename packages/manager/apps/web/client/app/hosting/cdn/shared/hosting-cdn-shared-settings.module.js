import routing from './hosting-cdn-shared-settings.routing';
import service from './hosting-cdn-shared-settings.service';
import component from './hosting-cdn-shared-settings.component';

import cdnChangeOffer from './cdn-change-offer';
import cors from './cors';
import editUrls from './edit-urls';
import sharedAddCacheRule from './add-edit-cache-rule/hosting-shared-add-edit-cache-rule.module';
import sharedLeaveConfirmSettings from './leave-confirm-settings';

const moduleName = 'ovhManagerHostingCdnShared';
angular
  .module(moduleName, [
    cdnChangeOffer,
    cors,
    editUrls,
    sharedAddCacheRule,
    sharedLeaveConfirmSettings,
  ])
  .component('hostingCdnSharedSettings', component)
  .service('HostingCdnSharedService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
