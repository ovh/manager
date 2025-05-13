import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    disableRegionLink: '<?',
    getStateName: '&',
    onGoToRegion: '&?',
    onActivationRegionLinkClick: '&?',
  },
  controller,
  template,
};

export default component;
