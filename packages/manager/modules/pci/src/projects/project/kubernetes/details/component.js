import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    cluster: '<',
    containersLink: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    nodePoolsLink: '<',
    serviceLink: '<',
  },
  template,
  controller,
};

export default component;
