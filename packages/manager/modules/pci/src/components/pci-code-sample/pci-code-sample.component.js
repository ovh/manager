import controller from './pci-code-sample.controller';
import template from './pci-code-sample.html';

import './pci-code-sample.scss';

export default {
  bindings: {
    code: '<',
    language: '<',
  },
  controller,
  template,
};
