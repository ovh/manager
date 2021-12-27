import controller from './app-attach.controller';
import template from './app-attach.html';

export default {
  bindings: {
    volumes: '=',
    storages: '<',
  },
  require: {
    appAttachForm: '^form',
  },
  controller,
  template,
};
