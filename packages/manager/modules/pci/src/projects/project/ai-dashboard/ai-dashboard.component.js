import controller from './ai-dashboard.controller';
import template from './ai-dashboard.html';

import './style.scss';

export default {
  bindings: {
    projectId: '<',
    trackingPrefix: '<',
    aiItems: '<',
    aiUsers: '<',
    aiTokens: '<',
    currentActiveLink: '<',
    homeLink: '<',
    usersTokensLink: '<',
    cliLink: '<',
    registriesLink: '<',
  },
  controller,
  template,
};
