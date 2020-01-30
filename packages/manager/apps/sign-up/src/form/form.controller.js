import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';

export default class SignUpFormAppCtrl {
  constructor() {
    this.isActivityStepVisible = false;
    this.saveError = null;

    this.loading = {
      init: true,
    };
  }

  /* =============================
  =            Events            =
  ============================== */

  onRulesUpdated({ rules }) {
    this.loading.init = false;

    if (rules) {
      this.isActivityStepVisible = some(
        [
          'organisation',
          'vat',
          'nationalIdentificationNumber',
          'companyNationalIdentificationNumber',
          'corporationType',
        ],
        (fieldName) => get(rules, `${fieldName}`) !== undefined,
      );
    }
  }

  onStepperFinished() {
    this.saveError = null;

    // call to finishSignUp binding
    if (isFunction(this.finishSignUp)) {
      return this.finishSignUp().catch((error) => {
        this.saveError = error;
      });
    }

    return null;
  }

  /* -----  End of Events  ------ */

  $onInit() {
    this.saveError = null;
    this.loading.init = true;

    if (this.me.state === 'incomplete') {
      this.me.legalform = null;
    }
  }
}
