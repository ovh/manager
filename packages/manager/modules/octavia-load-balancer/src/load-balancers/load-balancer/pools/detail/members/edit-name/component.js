import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    poolId: '<',
    memberId: '<',
    memberName: '<',
    goBack: '<',
    trackEditMemberAction: '<',
    trackEditMemberPage: '<',
  },
  controller,
  template,
};
