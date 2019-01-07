import angular from 'angular';
import ngTranslate from 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import ovhContactsService from './ovh-contacts.service';
import ovhContactFormDirective from './form/ovh-contacts-form.directive';
import './form/ovh-contacts-form.scss';

import ovhContactsFormStepperTemplate from './form/templates/ovh-contacts-form-stepper.html';
import ovhContactsFormFieldsetTemplate from './form/templates/ovh-contacts-form-fieldset.html';

import ouiUiSelectTemplate from './form/oui-ui-select-flag/select.tpl.html';
import ouiUiSelectChoicesTemplate from './form/oui-ui-select-flag/choices.tpl.html';
import ouiUiSelectMatchTemplate from './form/oui-ui-select-flag/match.tpl.html';

const moduleName = 'ngOvhContacts';

angular
  .module(moduleName, [
    ngTranslate,
    'oui',
    'ovh-api-services',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .service('ovhContacts', ovhContactsService)
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

    $templateCache.put('oui-ui-select-flag/match.tpl.html', ouiUiSelectMatchTemplate);
    $templateCache.put('oui-ui-select-flag/choices.tpl.html', ouiUiSelectChoicesTemplate);
    $templateCache.put('oui-ui-select-flag/select.tpl.html', ouiUiSelectTemplate);
  });

export default moduleName;
