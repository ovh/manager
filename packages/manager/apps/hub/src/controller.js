export default class HubController {
  /* @ngInject */
  constructor($translate, SessionService) {
    this.$translate = $translate;
    this.SessionService = SessionService;
  }

  $onInit() {
    [this.currentLanguage] = this.$translate.use().split('_');

    this.SessionService.getUser().then((user) => {
      this.user = user;
    });
  }
}
