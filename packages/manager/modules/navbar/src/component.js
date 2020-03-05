import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    brandLabel: '@',
    globalSearchLink: '@?',
    langOptions: '<?',
    navbarOptions: '<?',
    sidebarLinks: '<?',
    sidebarExpand: '<?', // always display sidebar in non-responsive view
    universeClick: '&?',
  },
  controller,
  template,
  transclude: {
    sidebar: '?ovhManagerSidebar',
  },
};

export default component;
