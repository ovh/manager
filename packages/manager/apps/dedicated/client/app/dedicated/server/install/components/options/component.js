import template from './index.html';

export default {
  name: 'dedicatedServerInstallOptions',
  template,
  bindings: {
    model: '<',
    sshKeys: '<',
  },
};
