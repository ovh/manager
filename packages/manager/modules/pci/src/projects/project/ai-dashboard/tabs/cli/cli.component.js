import controller from './cli.controller';
import template from './cli.html';

import 'highlight.js/styles/stackoverflow-dark.css';

export default {
  controller,
  template,
  bindings: {
    trackingPrefix: '<',
    usersTokensLink: '<',
    cliGuides: '<',
    regions: '<',
    currentRegion: '<',
  },
};
