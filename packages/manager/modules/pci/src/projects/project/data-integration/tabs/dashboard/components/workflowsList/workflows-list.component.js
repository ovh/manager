import template from './workflows-list.html';
import controller from './workflows-list.controller';

import './style.scss';

export default {
  bindings: {
    workflows: '<?',
    onChange: '&?',
    selectedWorkflow: '=',
  },
  controller,
  template,
};
