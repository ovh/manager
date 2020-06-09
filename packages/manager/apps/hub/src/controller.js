import { isString } from 'lodash-es';

export default class HubController {
  /* @ngInject */
  constructor($document, $translate, SessionService) {
    this.$document = $document;
    this.$translate = $translate;
    this.SessionService = SessionService;
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
