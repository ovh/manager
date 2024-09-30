import { getShellClient } from './shell';

export default class HubController {
  /* @ngInject */
  constructor() {
    this.shell = getShellClient();
    this.isAccountSidebarVisible = false;
  }

  async $onInit() {
    this.isAccountSidebarVisible = await this.shell.ux.isAccountSidebarVisible();
  }
}
