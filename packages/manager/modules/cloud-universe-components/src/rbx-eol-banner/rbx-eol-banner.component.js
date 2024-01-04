import controller from './rbx-eol-banner.controller';
import template from './rbx-eol-banner.html';

export default {
  bindings: {
    displayEolMessage: '<',
    displayImminentEolMessage: '<',
  },
  controller,
  name: 'ovhManagerRbxEolBanner',
  template,
};
