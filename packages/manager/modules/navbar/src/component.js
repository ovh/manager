import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    brandLabel: '@',
    langOptions: '<?',
    navbarOptions: '<?',
  },
  controller,
  template,
};

export default component;
