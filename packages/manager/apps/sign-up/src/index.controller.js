import get from 'lodash/get';

import { HOME_PAGE, OVH_LOGO } from './constants';

export default class SignUpCtrl {
  /* @ngInject */
  constructor(ssoAuthentication) {
    // dependencies injections
    this.ssoAuthentication = ssoAuthentication;

    // other attributes used in view
    this.logoUrl = null;
    this.logoSrc = OVH_LOGO;
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    return this.ssoAuthentication.getSsoAuthPendingPromise().then(() => {
      this.logoUrl = get(
        HOME_PAGE,
        this.ssoAuthentication.user.ovhSubsidiary,
        HOME_PAGE.default,
      );
    });
  }

  /* -----  End of Hooks  ------ */
}
