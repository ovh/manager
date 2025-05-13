import set from 'lodash/set';

import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhSignUpFormView';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, ouiStepperConfiguration) => {
      // set some translations for oui-kit
      $translate.refresh().then(() => {
        set(
          ouiStepperConfiguration,
          'translations.nextButtonLabel',
          $translate.instant('sign_up_form_next_button'),
        );
        set(
          ouiStepperConfiguration,
          'translations.submitButtonLabel',
          $translate.instant('sign_up_form_submit_button'),
        );
      });
    },
  )
  .component(component.name, component);

export default moduleName;
