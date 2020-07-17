import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import ovhContactsProvider from './ovh-contacts.provider';
import ovhContactFormDirective from './form/ovh-contacts-form.directive';
import './form/ovh-contacts-form.scss';

import ovhContactsFormStepperTemplate from './form/templates/ovh-contacts-form-stepper.html';
import ovhContactsFormFieldsetTemplate from './form/templates/ovh-contacts-form-fieldset.html';

import ouiUiSelectTemplate from './form/oui-ui-select-flag/select.tpl.html';
import ouiUiSelectChoicesTemplate from './form/oui-ui-select-flag/choices.tpl.html';
import ouiUiSelectMatchTemplate from './form/oui-ui-select-flag/match.tpl.html';

const moduleName = 'ngOvhContacts';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', 'ovh-api-services'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .provider('ovhContacts', ovhContactsProvider)
  .directive('ovhContactForm', ovhContactFormDirective)
  .run(($templateCache) => {
    // add different template for ovh-contacts-form
    // add default one: stepper
    $templateCache.put(
      'ovh-contacts-form/templates/ovh-contacts-form-stepper.html',
      ovhContactsFormStepperTemplate,
    );

    // add fieldset
    $templateCache.put(
      'ovh-contacts-form/templates/ovh-contacts-form-fieldset.html',
      ovhContactsFormFieldsetTemplate,
    );

    $templateCache.put(
      'oui-ui-select-flag/match.tpl.html',
      ouiUiSelectMatchTemplate,
    );
    $templateCache.put(
      'oui-ui-select-flag/choices.tpl.html',
      ouiUiSelectChoicesTemplate,
    );
    $templateCache.put(
      'oui-ui-select-flag/select.tpl.html',
      ouiUiSelectTemplate,
    );
  });

export default moduleName;
