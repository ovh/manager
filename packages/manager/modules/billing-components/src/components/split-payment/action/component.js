import controller from './controller';
import template from './index.html';

export default {
  bindings: {
    action: '<',
    actionLabelKey: '<',
    actionWarningText: '<',
    displayDecreeHref: '<',
    errorMessageKey: '<',
    goBack: '<',
    successMessageKey: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
