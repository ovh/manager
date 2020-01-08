import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import TucToast from '../toaster';
import TucToastError from './toast-error.service';

const moduleName = 'tucToastError';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate, TucToast])
  .service('TucToastError', TucToastError)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
