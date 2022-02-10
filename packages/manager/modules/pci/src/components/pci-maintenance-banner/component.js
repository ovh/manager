import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    steins: '<',
    customerRegions: '<',
    productRegions: '<?',
    productRegion: '<',
    isProjectPage: '<?',
    isListPage: '<?',
    isDashboardPage: '<?',
    projectName: '<?',
    productName: '<?',
    productServiceName: '<?',
    onMaintenanceLinkClick: '&?',
  },
  controller,
  template,
};

export default component;
