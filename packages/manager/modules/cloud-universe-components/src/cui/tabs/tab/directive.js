import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';

import controller from './controller';
import template from './template.html';

export default () => ({
  replace: true,
  restrict: 'E',
  require: ['^^cuiTabs', 'cuiTab'],
  controller,
  controllerAs: '$ctrl',
  scope: true,
  transclude: true,
  template,
  bindToController: {
    active: '<',
    state: '@',
    stateParams: '<',
    text: '<',
    disabled: '<',
  },
  link: ($scope, $element, $attrs, $ctrls) => {
    const parentCtrl = $ctrls[0];
    const childCtrl = $ctrls[1];
    let tabAttr = pick(childCtrl, ['active', 'state', 'stateParams', 'text']);

    // We purge undefined attributes from the object.
    tabAttr = pickBy(tabAttr, identity);

    tabAttr.updateActive = (active, isActivating) => {
      tabAttr.active = active;
      tabAttr.isActivating = isActivating;
      childCtrl.updateActive(tabAttr);
    };

    parentCtrl.addTab(tabAttr);
  },
});
