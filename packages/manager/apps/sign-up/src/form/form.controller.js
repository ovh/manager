import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';
import { INDIAN_SUBSIDIARY } from '../constants';
import {
  BUTTON_TRACKING_PREFIX,
  CHAPTER_1,
  DISPLAY_ROOT_PAGE_TRACKING,
  REQUEST_RESULT_TRACKING_PREFIX,
  SUBMIT_FORM_GOAL_TYPE,
  SUBMIT_FORM_TRACKING_PREFIX,
} from '../at-internet.constants';

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
    const hits = [
      BUTTON_TRACKING_PREFIX,
      `create_account_step${step === 'details' ? '3' : '4'}`,
      'cancel',
      `${this.me.model.legalform}_${this.me.ovhSubsidiary}`,
    ];
    this.atInternet.trackClick({
      name: hits.join('::'),
      type: 'action',
      page_category: CHAPTER_1,
      page: {
        name: DISPLAY_ROOT_PAGE_TRACKING,
      },
    });
    return this.cancelStep(step);
  }

  onStepperFinished() {
    this.saveError = null;
    const hits = [
      SUBMIT_FORM_TRACKING_PREFIX,
      `${this.me.model.legalform}_${this.me.ovhSubsidiary}`,
    ];

    const tracking = {
      name: hits.join('::'),
      type: 'action',
      goalType: SUBMIT_FORM_GOAL_TYPE,
      accountcreationSiretProvided: this.me.model
        .companyNationalIdentificationNumber
        ? 'Provided'
        : '',
      page_category: CHAPTER_1,
      page: {
        name: DISPLAY_ROOT_PAGE_TRACKING,
      },
    };

    if (this.isSmsConsentAvailable) {
      tracking.accountSmsConsent = this.smsConsent ? 'opt-in' : 'opt-out';
      tracking.accountPhoneType = this.me.model.phoneType;
    }

    this.atInternet.trackClick(tracking);

    // call to finishSignUp binding
    if (isFunction(this.finishSignUp)) {
      const getTrackingHits = (status) => [
        REQUEST_RESULT_TRACKING_PREFIX,
        `confirmation_${status}`, // 'success' | 'error'
        `${this.me.model.legalform}_${this.me.ovhSubsidiary}`,
      ];
      return this.finishSignUp(this.smsConsent)
        .then(() => {
          this.atInternet.trackPage({
            name: getTrackingHits('success').join('::'),
            page_category: 'banner',
            goalType: 'account-creation-finalstep',
          });
          if (this.needkyc) this.goToKycDocumentUploadPage();
        })
        .catch((error) => {
          this.saveError = error;
          this.atInternet.trackPage({
            name: getTrackingHits('error').join('::'),
            page_category: 'banner',
            goalType: 'account-creation-finalstep',
          });
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

    this.atInternet.trackPage({
      name: DISPLAY_ROOT_PAGE_TRACKING,
      page_category: CHAPTER_1,
    });
  }
}
