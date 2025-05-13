import controller from './restart-button.controller';
import template from './restart-button.html';
import './restart-button.scss';

export default {
  bindings: {
    onClick: '&?',
    disabled: '<?',
  },
  controller,
  template,
};
