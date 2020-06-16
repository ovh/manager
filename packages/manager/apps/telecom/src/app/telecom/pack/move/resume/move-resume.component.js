import controller from './move-resume.controller';
import template from './move-resume.html';

export default {
  controller,
  template,
  bindings: {
    offer: '<',
    packName: '<',
  },
};
