export default class {
  /* @ngInject */
  constructor() {
    this.showLivechat = false;
  }

  setShowLivechat(showLivechat) {
    this.showLivechat = showLivechat;
  }

  getShowLivechat() {
    return this.showLivechat;
  }
}
