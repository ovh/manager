import controller from './controller';
import template from './template.html';

export default () => ({
  transclude: true,
  template,
  controller,
  controllerAs: '$ctrl',
  replace: true,
  restrict: 'E',
  scope: true,
  bindToController: {
    title: '<',
    text: '<',
    expanded: '<',
    actions: '<',
    ariaLabel: '@',
  },
});
