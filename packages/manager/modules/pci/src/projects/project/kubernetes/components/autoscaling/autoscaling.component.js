import controller from './autoscaling.controller';
import template from './autoscaling.html';

export default {
  bindings: {
    isEditMode: '<',
    displayNodePoolSizing: '<',
    nodePool: '<',
    onLinkClicked: '&?',
    onAutoscaleChanged: '&?',
    onLowestPoolValueChange: '&?',
    onDesiredPoolValueChange: '&?',
    onHighestPoolValueChange: '&?',
  },
  controller,
  template,
};
