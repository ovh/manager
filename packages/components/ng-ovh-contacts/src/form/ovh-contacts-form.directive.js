import _ from 'lodash';

import controller from './ovh-contact-form.controller';

export default () => ({
  restrict: 'E',
  require: '?^^form',
  scope: {
    mode: '@',
    predefinedProfile: '@',
  },
  templateUrl: (element, attributes) => {
    const mode = _.get(attributes, 'mode', 'stepper');
    return `ovh-contacts-form/templates/ovh-contacts-form-${mode}.html`;
  },
  controller,
  bindToController: true,
  controllerAs: '$ctrl',
});
