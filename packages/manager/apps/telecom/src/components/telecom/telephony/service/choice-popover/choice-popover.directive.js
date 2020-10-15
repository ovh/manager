import kebabCase from 'lodash/kebabCase';

import controller from './choice-popover.controller';

export default /* @ngInject */ ($compile) => ({
  restrict: 'A',
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  compile() {
    // need to use pre and post compile function to be abble to add popover attribute to element
    let curAttrContent;

    return {
      pre(tScope, tElement) {
        // first remove attribute of directive (to avoid $compile to loop)
        curAttrContent = tElement.attr('data-voip-service-choice-popover');
        tElement.removeAttr('data-voip-service-choice-popover');
      },
      post(tScope, tElement, tAttributes, tCtrl) {
        // add attribute to element to allow a popover on it
        tElement.attr(
          'data-responsive-popover',
          "'components/telecom/telephony/service/choice-popover/choice-popover.html'",
        );
        angular.forEach(tCtrl.popoverOptions, (optionValue, key) => {
          const tmpAttrKey = `data-${kebabCase(key)}`;
          if (key !== 'popoverIsOpen') {
            tElement.attr(tmpAttrKey, optionValue);
          } else {
            tElement.attr(tmpAttrKey, '$ctrl.popoverOptions.popoverIsOpen');
          }
        });

        $compile(tElement)(tScope);
        tElement.attr('data-voip-service-choice-popover', curAttrContent);
      },
    };
  },
  scope: {
    popoverOptions: '=voipServiceChoicePopover',
    availableTypes: '<?',
    hiddenGroups: '<?',
    onChoiceValidated: '&?',
    onChoiceCancel: '&?',
    choiceArgs: '<?',
    excludeServices: '<?',
  },
});
