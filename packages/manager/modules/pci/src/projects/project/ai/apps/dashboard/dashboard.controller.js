import { APP_USERS_TOKENS_BANNER_TRACKING } from '../app.constants';

export default class AiAppsDashboardCtrl {
  goToUserToken() {
    this.trackApps(APP_USERS_TOKENS_BANNER_TRACKING);
    this.goToUsersAndTokens();
  }
}
