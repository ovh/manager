import template from './insufficient-quota.html';
import controller from './insufficient-quota.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    publicCloudName: '<',
    quotas: '<',
  },
  template,
  controller,
};

export default component;
