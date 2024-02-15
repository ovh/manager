import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    loadBalancerId: '<',
    loadBalancerName: '<',
    loadBalancerRegion: '<',
    projectId: '<',
    goBack: '<',
    trackDeletionAction: '<',
    trackDeletionPage: '<',
  },
  controller,
  template,
};
