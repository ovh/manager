import template from './jobs-list.html';
import controller from './jobs-list.controller';

import './style.scss';

export default {
  bindings: {
    jobs: '<?',
  },
  template,
  controller,
};
