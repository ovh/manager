import {
  DKIM_STATUS,
  DKIM_STATUS_TEXT,
  DKIM_MODAL_TITLE,
  DKIM_PRIMARY_BUTTON_LABEL,
  DKIM_SECONDARY_BUTTON_LABEL,
  DKIM_CONFIGURATION_GUIDE_NO_OVH,
} from './email-domain-dkim.constants';

export default class EmailDomainDkimCtrl {
  /* @ngInject */
  constructor($translate, WucEmails, coreConfig) {
    this.$translate = $translate;
    this.WucEmails = WucEmails;
    this.DKIM_PRIMARY_BUTTON_LABEL = DKIM_PRIMARY_BUTTON_LABEL;
    this.DKIM_SECONDARY_BUTTON_LABEL = DKIM_SECONDARY_BUTTON_LABEL;
    this.DKIM_STATUS_TEXT = DKIM_STATUS_TEXT;
    this.DKIM_MODAL_TITLE = DKIM_MODAL_TITLE;
    this.dkimGuideLinkNoOvh =
      DKIM_CONFIGURATION_GUIDE_NO_OVH[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE_NO_OVH.DEFAULT;
  }

  $onInit() {
    if (!this.dkim.autoconfig) {
      this.initContext();
    }
  }

  getPrimaryAction() {
    if (
      [DKIM_STATUS.ENABLED, DKIM_STATUS.DISABLED].includes(this.dkim.status)
    ) {
      this.isSubmitting = true;
      const promise =
        this.dkim.status === DKIM_STATUS.DISABLED
          ? this.WucEmails.enableDkim(this.serviceName)
          : this.WucEmails.disableDkim(this.serviceName);
      return promise
        .then(() => {
          return this.goBack(
            this.$translate.instant('email_domain_dkim_activation_success'),
            'success',
            true,
          );
        })
        .catch(({ data }) => {
          return this.goBack(
            this.$translate.instant('email_domain_dkim_error', {
              message: data?.message,
            }),
            'danger',
          );
        });
    }
    return this.goBack();
  }

  initContext() {
    this.selector1NoDomain = {
      customerRecord: this.dkim.selectors[0].selectorName,
      targetRecord: this.dkim.selectors[0].cname,
    };

    this.selector1RecordInfos = this.getDkimRecord(1);
    this.selector2NoDomain = {
      customerRecord: this.dkim.selectors[1].selectorName,
      targetRecord: this.dkim.selectors[1].cname,
    };

    this.selector2RecordInfos = this.getDkimRecord(2);
  }

  getDkimRecord(index) {
    return [
      `<b>${this.$translate.instant('email_domain_dkim_cname', {
        value: index,
      })}</b>: `,
      this[`selector${index}NoDomain`].targetRecord,
    ].join('');
  }
}
