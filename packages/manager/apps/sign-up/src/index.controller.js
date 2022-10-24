import get from 'lodash/get';

import { HOME_PAGE, LOGO_SRC } from './constants';

export default class SignUpCtrl {
  /* @ngInject */
  constructor(coreConfig, ssoAuthentication) {
    // dependencies injections
    this.coreConfig = coreConfig;
    this.ssoAuthentication = ssoAuthentication;

    // other attributes used in view
    this.logoUrl = null;
    this.logoSrc = LOGO_SRC.default;
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.logoSrc =
      this.coreConfig.getRegion() === 'US' ? LOGO_SRC.US : LOGO_SRC.default;

    this.logoUrl = get(
      HOME_PAGE,
      this.coreConfig.getUser().ovhSubsidiary,
      HOME_PAGE.default,
    );
  }

  /* -----  End of Hooks  ------ */
}
