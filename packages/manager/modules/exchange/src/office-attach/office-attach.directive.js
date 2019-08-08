import controller from './office-attach.controller';
import template from './office-attach.html';

export default () => ({
  restrict: 'E',
  template,
  controller,
  controllerAs: '$ctrl',
  scope: false,
  replace: true,
});
