import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    poolId: '<',
    memberId: '<',
    memberName: '<',
    goBack: '<',
    trackDeleteAction: '<',
    trackDeletePage: '<',
  },
  controller,
  template,
};
