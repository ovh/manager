import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';

const OVH_SUBSIDIARY_ITEM_NAME = 'ovhSubsidiaryCreationForm';
const US_DEFAULT_LANGUAGE = 'en';

export default class SignUpFormAppCtrl {
  /* @ngInject */
  constructor($location, coreConfig, atInternet) {
    this.$location = $location;
    this.coreConfig = coreConfig;
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

    /**
     * temporary fixed to avoid inherit another language for US customers
     * TODO: It's better to have a feature to allow customers change the language as we have across Manager
     */
    const { lang } = this.$location.search();
    if (this.coreConfig.isRegion('US') && lang !== US_DEFAULT_LANGUAGE) {
      this.$location.search('lang', US_DEFAULT_LANGUAGE);
    }

    const { ovhSubsidiary } = this.$location.search();
    if (ovhSubsidiary && ovhSubsidiary.match(/^[\w]{2}$/)) {
      localStorage.setItem(OVH_SUBSIDIARY_ITEM_NAME, ovhSubsidiary);
    }

    if (this.me.state === 'incomplete') {
      this.me.legalform = null;
    }
  }
}
