import get from 'lodash/get';

import controller from './ovh-contact-form.controller';

export default () => ({
  restrict: 'E',
  require: {
    contactFormCtrl: 'ovhContactForm',
    formCtrl: '?^^form',
  },
  scope: {
    model: '<',
    mode: '@',
    predefinedProfile: '@',
  },
  templateUrl: (element, attributes) => {
    const mode = get(attributes, 'mode', 'stepper');
    return `ovh-contacts-form/templates/ovh-contacts-form-${mode}.html`;
  },
  link: (scope, element, attributes, ctrls) => {
    const controllers = ctrls;

    controllers.contactFormCtrl.setElementFocus = (elementName) => {
      element.find(`[name="${elementName}"]`).focus();
    };
  },
  controller,
  bindToController: true,
  controllerAs: '$ctrl',
});
