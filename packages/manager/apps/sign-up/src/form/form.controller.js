import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';

const OVH_SUBSIDIARY_ITEM_NAME = 'ovhSubsidiaryCreationForm';

export default class SignUpFormAppCtrl {
  /* @ngInject */
  constructor($location, atInternet) {
    this.$location = $location;
    this.atInternet = atInternet;
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

    this.atInternet.trackPage({
      name: `accountcreation-ok-${this.me.model.legalform}`,
    });

    // call to finishSignUp binding
    if (isFunction(this.finishSignUp)) {
      return this.finishSignUp()
        .then(() => {
          localStorage.removeItem(OVH_SUBSIDIARY_ITEM_NAME);
        })
        .catch((error) => {
          this.saveError = error;
        });
    }

    return null;
  }

  /* -----  End of Events  ------ */

  $onInit() {
    this.saveError = null;
    this.loading.init = true;

    const { ovhSubsidiary } = this.$location.search();
    if (ovhSubsidiary && ovhSubsidiary.match(/^[\w]{2}$/)) {
      localStorage.setItem(OVH_SUBSIDIARY_ITEM_NAME, ovhSubsidiary);
    }

    if (this.me.state === 'incomplete') {
      this.me.legalform = null;
    }
  }
}
