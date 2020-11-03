import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import '@ovh-ux/ng-at-internet';

import component from './new-account-form-component';
import fieldComponent from './field/new-account-form-field.component';
import constant from './new-account-form.config';

const moduleName = 'ovhManagerUserAccountInfosNewAccountForm';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('newAccountForm', component)
  .component('newAccountFormField', fieldComponent)
  .constant('NewAccountFormConfig', constant)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
