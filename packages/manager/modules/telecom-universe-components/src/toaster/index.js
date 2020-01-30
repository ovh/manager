import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import tucToastMessage from './toast-message.component';
import tucToastMessageScrollerDirective from './toast-message-scroller.directive';
import TucToast from './toast.service';

const moduleName = 'tucToaster';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .component('tucToastMessage', tucToastMessage)
  .directive('tucToastMessageScroller', tucToastMessageScrollerDirective)
  .service('TucToast', TucToast)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
