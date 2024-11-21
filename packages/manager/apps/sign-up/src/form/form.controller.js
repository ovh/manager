import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';
import { INDIAN_SUBSIDIARY } from '../constants';
import { TRACKING_DETAILS } from '../at-internet.constants';

export default class SignUpFormAppCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.isActivityStepVisible = false;
    this.saveError = null;

    this.isValid = false;
    this.smsConsent = false;

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
    const { chapter1, chapter2, chapter3 } = TRACKING_DETAILS;
    const hits = [
      chapter1,
      chapter2,
      chapter3,
      'page',
      'button',
      `create_account_step${step === 'details' ? '3' : '4'}`,
      'cancel',
      `${this.me.model.legalform}_${this.me.ovhSubsidiary}`,
    ];
    this.atInternet.trackClick({
      name: hits.join('::'),
      type: 'action',
    });
    return this.cancelStep(step);
  }

  onStepperFinished() {
    this.saveError = null;
    const { chapter1, chapter2, chapter3, goalType } = TRACKING_DETAILS;
    const hits = [
      chapter1,
      chapter2,
      chapter3,
      'page',
      'button',
      'create_account_finalstep',
      'confirmation',
      `${this.me.model.legalform}_${this.me.ovhSubsidiary}`,
    ];

    const tracking = {
      name: hits.join('::'),
      type: 'action',
      chapter1,
      chapter2,
      chapter3,
      goalType,
      accountcreationSiretProvided: this.me.model
        .companyNationalIdentificationNumber
        ? 'Provided'
        : '',
    };

    if (this.isSmsConsentAvailable) {
      tracking.accountSmsConsent = this.smsConsent ? 'opt-in' : 'opt-out';
      tracking.accountPhoneType = this.me.model.phoneType;
    }

    this.atInternet.trackClick(tracking);

    // call to finishSignUp binding
    if (isFunction(this.finishSignUp)) {
      return this.finishSignUp(this.smsConsent)
        .then(() => {
          if (this.needkyc) this.goToKycDocumentUploadPage();
        })
        .catch((error) => {
          this.saveError = error;
        });
    }
    if (this.needkyc) {
      this.goToKycDocumentUploadPage();
    }

    return null;
  }

  /* -----  End of Events  ------ */

  $onInit() {
    this.saveError = null;
    this.loading.init = true;

    this.isIndiaSubsidiary = this.subsidiary === INDIAN_SUBSIDIARY;

    if (this.me.state === 'incomplete') {
      this.me.legalform = null;
    }

    const { chapter1, chapter2, chapter3 } = TRACKING_DETAILS;
    const hits = [
      chapter1,
      chapter2,
      chapter3,
      'create_account_step3',
      'fill-in_contact_details',
    ];
    this.atInternet.trackPage({
      name: hits.join('::'),
      type: 'action',
    });
  }
}
