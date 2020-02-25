import controller from './vps-veeam.controller';
import template from './vps-veeam.html';

export default {
  controller,
  bindings: {
    goToVeeamRestore: '<',
    goToVeeamMount: '<',
  },
  name: 'vpsVeeam',
  template,
};
