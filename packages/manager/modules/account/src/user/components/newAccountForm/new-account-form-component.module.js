import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import '@ovh-ux/sign-up';

import component from './new-account-form-component';
import fieldComponent from './field/new-account-form-field-component';
import einvoicingComponent from './einvoicing/new-account-form-einvoicing.component';
import {
  ACCOUNT_READ_ONLY,
  removeConfirmationCheckbox,
} from '../../../account.constants';

const moduleName = 'UserNewAccountForm';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ovhSignUp',
  ])
  .component('newAccountForm', component)
  .component('newAccountFormField', fieldComponent)
  .component('newAccountFormEinvoicing', einvoicingComponent)
  .config(
    /* @ngInject */ ($provide) => {
      if (!ACCOUNT_READ_ONLY) return;
      // Account edition is suspended: drop the "information is correct"
      // checkbox of the shared SIRET component in the account section only,
      // so no action looks possible. Sign-up does not load this module.
      $provide.decorator(
        'siretComponentDirective',
        /* @ngInject */ ($delegate) => {
          const [directive] = $delegate;
          directive.template = removeConfirmationCheckbox(directive.template);
          return $delegate;
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
