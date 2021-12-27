import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    steins: '<',
    customerRegions: '<',
    isProjectPage: '<?',
    productRegions: '<?',
    onMaintenanceLinkClick: '&?',
  },
  controller,
  template,
};

export default component;
