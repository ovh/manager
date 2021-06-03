import template from './dashboard.html';

export default {
  bindings: {
    notebook: '<',
    guideUrl: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    attachDataLink: '<',
    userAndRolesLink: '<',
  },
  template,
};
