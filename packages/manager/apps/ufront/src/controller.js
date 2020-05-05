import isString from 'lodash/isString';

export default class HubController {
  /* @ngInject */
  constructor($document, $sce, $translate, SessionService) {
    this.$document = $document;
    this.$translate = $translate;
    this.SessionService = SessionService;
    this.uAppURL = $sce.trustAsResourceUrl(__U_FRONTEND_ROOT__);
  }

  $onInit() {
    [this.currentLanguage] = this.$translate.use().split('_');

    this.SessionService.getUser().then((user) => {
      this.user = user;
    });
  }

  /**
   * Set focus on the specified element.
   * @param  {string} id Element to locate.
   * @return {void}
   */
  setFocus(id) {
    if (isString(id)) {
      const [element] = this.$document.find(`#${id}`);
      element.focus();
    }
  }
}
