import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    restrictions: '<',
    updateRestrictions: '<',
    deleteRestriction: '<',
    sendKubeTrack: '<',
  },
  controller,
  template,
};

export default component;
