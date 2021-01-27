import { Selector, t } from 'testcafe';
import { URL } from 'url';

export default class AuthLoginPage {
  constructor(config) {
    this.url = config.auth.url;
    this.baseUrl = config.baseUrl;
    this.userNic = config.auth.userNic;
    this.userPass = config.auth.userPass;

    const loginForm = Selector('#login-form');
    this.usernameInput = loginForm.find('input[type=text]');
    this.passwordInput = loginForm.find('input[type=password]');
    this.submitButton = loginForm.find('button[type=submit]');
  }

  getLoginUrl(onsuccess = this.baseUrl) {
    const url = new URL(this.url);
    url.searchParams.set('onsuccess', onsuccess);
    return url.toString();
  }

  getLogoutUrl() {
    const url = new URL(this.url);
    url.searchParams.set('action', 'disconnect');
    return url.toString();
  }

  async login() {
    await t
      .typeText(this.usernameInput, this.userNic)
      .typeText(this.passwordInput, this.userPass)
      .click(this.submitButton);
  }

  async logout() {
    await t.navigateTo(this.getLogoutUrl());
    await t.expect(this.passwordInput.visible).ok();
  }
}
