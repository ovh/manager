class UserSessionService {
  constructor($translate) {
    this.$translate = $translate;
  }

  getCurrentLocale() {
    this.$translate.use().replace('_', '-').toLowerCase();
  }

  loadTranslations() {
    // Add all $translatePartialLoader for Navbar here
    // Not used for the moment
    return this.$translate.refresh();
  }
}

angular.module('services').service('UserSessionService', UserSessionService);
