import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './new-account-form-component';
import fieldComponent from './field/new-account-form-field-component';

const moduleName = 'UserNewAccountForm';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('newAccountForm', component)
  .component('newAccountFormField', fieldComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
