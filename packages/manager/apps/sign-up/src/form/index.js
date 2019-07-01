import set from 'lodash/set';

import angular from 'angular';
import 'ovh-ui-angular';

import component from './component';

const moduleName = 'ovhSignUpFormView';

angular
  .module(moduleName, [
    'oui',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($translate, ouiStepperConfiguration) => {
    // set some translations for oui-kit
    $translate.refresh()
      .then(() => {
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
  })
  .component(component.name, component);

export default moduleName;
