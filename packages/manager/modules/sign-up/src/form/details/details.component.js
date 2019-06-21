import controller from './details.controller';
import template from './details.html';

export default {
  name: 'signUpDetails',
  restrict: 'E',
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^signUpForm',
    signUpDetailsCtrl: 'signUpDetails',
  },
  link: (scope, element, attributes, ctrls) => {
    const controllers = ctrls;

    // add a setFocus method accessible through controller
    controllers.signUpDetailsCtrl.setElementFocus = (elementName) => {
      document.getElementsByName(elementName)[0].focus();
    };
  },
};
