import template from './shipping-mode-selection.html';

export default {
  bindings: {
    selectedMode: '=ngModel',
    selectedRelay: '=?tucShippingModeSelectionRelay',
    options: '=?tucShippingModeSelectionOptions',
  },
  template,
  controller: 'tucShippingModeSelectionCtrl',
};
