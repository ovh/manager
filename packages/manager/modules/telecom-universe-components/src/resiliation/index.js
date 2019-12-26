import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-ui-bootstrap';

import tucResiliationReason, {
  templateConfirmation,
} from './resiliation-reason.component';

const moduleName = 'tucResiliation';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate, 'ui.bootstrap'])
  .component('tucResiliationReason', tucResiliationReason)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('resiliation.modal.html', templateConfirmation);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
