import controller from './ai-code-sample.controller';
import template from './ai-code-sample.html';

import './ai-code-sample.scss';

export default {
  bindings: {
    code: '<',
    language: '<',
  },
  controller,
  template,
};
