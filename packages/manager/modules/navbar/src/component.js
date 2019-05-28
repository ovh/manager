import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    brandLabel: '@',
    langOptions: '<?',
    navbarOptions: '<?',
    sidebarLinks: '<?',
    universeClick: '&?',
  },
  controller,
  template,
  transclude: {
    sidebar: '?ovhManagerSidebar',
  },
};

export default component;
