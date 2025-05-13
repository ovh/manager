import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import '@ovh-ux/ui-kit';

import component from './component';
import templates from './templates';

import sepaInformationModal from './sepa-information-modal/index.js';

const moduleName = 'ngOvhPaymentMethodRegister';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    sepaInformationModal,
  ])
  .run(
    /* @ngInject */ ($templateCache) => {
      Object.entries(templates).forEach(([id, template]) => {
        $templateCache.put(`ng-ovh-payment-method/${id}.html`, template);
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
