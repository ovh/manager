import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    langOptions: '<?',
  },
  controller,
  template,
};

export default component;
