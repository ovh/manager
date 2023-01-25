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

    this.isValid = false;

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

      let invalid = 0;

      Object.entries(rules).forEach(([key, value]) => {
        const modelItem = this.model[key];

        if (
          modelItem !== undefined &&
          (value.in &&
            !(typeof value.in[0] === 'string'
              ? value.in?.includes(modelItem)
              : !!value.in?.find((item) => item.value === modelItem)),
          value.regularExpression && modelItem
            ? !new RegExp(value.regularExpression).test(modelItem)
            : false,
          value.mandatory && !modelItem)
        ) {
          invalid += 1;
        }
      });

      this.isValid = invalid === 0;
    }
  }

  onStepFormCancel(step) {
    this.atInternet.trackPage({
      name: `accountcreation-step${step === 'details' ? '2' : '3'}-${
        this.me.model.legalform
      }::cancel`,
    });
    return this.cancelStep(step);
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
