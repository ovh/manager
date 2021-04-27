import angular from 'angular';
import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import sharedConfirmSettings from './confirm/hosting-shared-confirm-settings.module';
import sharedLeaveSettings from './leave';

const moduleName = 'ovhManagerHostingSharedLeaveConfirmSettings';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    sharedConfirmSettings,
    sharedLeaveSettings,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
