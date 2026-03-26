import template from './ng-phonenumber.html';
import controller from './ng-phonenumber.controller';

export default {
  bindings: {
    model: '=',
    name: '@?',
    id: '@?',
    label: '@?',
    helpText: '@?',
    errorText: '@?',
    inputClass: '@?',

    required: '<?',
    disabled: '<?',
    readonly: '<?',
    inline: '<?',

    defaultCountry: '@?',
    countries: '<?',
    placeholders: '<?',
    withoutLabel: '<?',

    onNumberChange: '&?',
    onCountryChange: '&?',
    onValidityChange: '&?',
  },
  template,
  controller,
};
