import template from './root.html';

export const APP_STATE = {
  abstract: true,
  name: 'app',
  redirectTo: 'app.account',
};

export const APP_ACCOUNT_STATE = {
  name: 'app.account',
  redirectTo: 'app.account.support',
  template,
};

export default {
  APP_STATE,
  APP_ACCOUNT_STATE,
};
