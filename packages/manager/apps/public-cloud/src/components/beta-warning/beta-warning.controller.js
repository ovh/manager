import illustration from './beta-warning.png';

const LOCALSTORAGE_KEY = 'OVH_MANAGER_PUBLIC_CLOUD_HIDE_BETA_WARNING';

export default class {
  /* @ngInject */

  constructor() {
    this.checked = false;
    this.illustration = illustration;
    this.isHidden = localStorage.getItem(LOCALSTORAGE_KEY) || false;
  }

  hide() {
    if (this.checked) {
      localStorage.setItem(LOCALSTORAGE_KEY, true);
    }
    this.isHidden = true;
  }
}
