import template from './vnc.html';

export default {
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    vncInfos: '<',
  },
};
