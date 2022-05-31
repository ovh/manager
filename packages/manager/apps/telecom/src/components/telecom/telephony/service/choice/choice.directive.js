import controller from './choice.controller';
import template from './choice.html';

export default /* @ngInject */ () => ({
  restrict: 'E',
  template,
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  scope: {
    availableTypes: '<?',
    hiddenGroups: '<?',
    onChoiceValidated: '&?',
    onChoiceChanged: '&?',
    onChoiceCancel: '&?',
    choiceArgs: '<?',
    excludeServices: '<?',
    wrapperClass: '=',
    containerClass: '=',
    hideHeader: '=',
    hideFooter: '=',
    stickyFooter: '=',
  },
});
