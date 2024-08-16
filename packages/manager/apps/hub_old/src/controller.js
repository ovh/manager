import { isString } from 'lodash-es';
import { getShellClient } from './shell';

export default class HubController {
  /* @ngInject */
  constructor($document) {
    this.$document = $document;
    this.shell = getShellClient();
    this.isAccountSidebarVisible = false;
  }

  async $onInit() {
    this.isAccountSidebarVisible = await this.shell.ux.isAccountSidebarVisible();
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
