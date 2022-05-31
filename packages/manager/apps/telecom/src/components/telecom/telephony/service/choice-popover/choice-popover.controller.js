import isFunction from 'lodash/isFunction';

export default /* @ngInject */ function voipServiceChoicePopoverCtrl() {
  const self = this;

  self.popoverStatus = {
    move: false,
    rightPage: null,
  };

  self.onValidate = function onValidate(selectedService, choiceArgs) {
    // close popover
    self.popoverOptions.popoverIsOpen = false;

    // call callback function
    if (self.onChoiceValidated && isFunction(self.onChoiceValidated())) {
      self.onChoiceValidated()(selectedService, choiceArgs);
    }
  };

  self.onCancel = function onCancel(choiceArgs) {
    // close popover
    self.popoverOptions.popoverIsOpen = false;

    // call callback function
    if (self.onChoiceCancel && isFunction(self.onChoiceCancel())) {
      self.onChoiceCancel()(choiceArgs);
    }
  };

  self.onChange = function onValidate(selectedService, choiceArgs) {
    // call callback function
    if (self.onChoiceChanged && isFunction(self.onChoiceChanged())) {
      self.onChoiceChanged()(selectedService, choiceArgs);
    }
  };
}
