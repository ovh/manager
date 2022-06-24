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
    preloadGroup: '@?',
    onChoiceValidated: '&?',
    onChoiceChanged: '&?',
    onChoiceCancel: '&?',
    choiceArgs: '<?',
    excludeServices: '<?',
    filterServices: '<?',
    wrapperClass: '=',
    containerClass: '=',
    hideHeader: '=',
    hideFooter: '=',
    stickyFooter: '=',
    title: '@?',
    value: '=?ngModel',
  },
});
