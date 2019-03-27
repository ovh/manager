import controller from './controller';
import template from './template.html';

export default () => ({
  restrict: 'E',
  template,
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  replace: false,
});
