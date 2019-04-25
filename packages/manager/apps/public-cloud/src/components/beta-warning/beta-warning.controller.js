import illustration from './beta-warning.png';

const LOCALSTRORAGE_KEY = 'ovhManagerPublicCloud_hideBetaWarning';

export default class {
  /* @ngInject */

  constructor() {
    this.checked = false;
    this.illustration = illustration;
    this.isHidden = localStorage.getItem(LOCALSTRORAGE_KEY) || false;
  }

  hide() {
    if (this.checked) {
      localStorage.setItem(LOCALSTRORAGE_KEY, true);
    }
    this.isHidden = true;
  }
}
