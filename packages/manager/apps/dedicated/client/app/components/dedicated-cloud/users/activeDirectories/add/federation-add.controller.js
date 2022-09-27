import {
  FIELD_NAME,
  GUIDE_FEDERATION,
  PLACEHOLDER,
} from './federation-add.constant';

export default class FederationAddCtrl {
  /* @ngInject */
  constructor($translate, Alerter, DedicatedCloud) {
    this.$translate = $translate;
    this.alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.FIELD_NAME = FIELD_NAME;
    this.PLACEHOLDER = PLACEHOLDER;

    this.guideFederationLink =
      GUIDE_FEDERATION[this.user.ovhSubsidiary] || GUIDE_FEDERATION.DEFAULT;

    this.model = {
      domainName: null,
      domainAlias: null,
      description: null,
      ip: null,
      ldapHostname: null,
      ldapTcpPort: null,
      sslThumbprint: null,
      username: null,
      password: null,
      baseDnForUsers: null,
      baseDnForGroups: null,
    };

    this.task = null;

    this.loaders = {
      submitted: false,
      submitting: false,
      action: false,
    };
  }

  onSubmit() {
    this.loaders.submitting = true;
    return this.DedicatedCloud.postActiveDirectories(this.productId, this.model)
      .then((data) => {
        this.loaders.submitted = true;
        this.loaders.action = true;
        this.task = data;
      })
      .catch(({ data: err }) => {
        this.alerter.error(
          `${this.$translate.instant('dedicatedCloud_USER_AD_ADD_error')} ${
            err.message
          }`,
          'federationAddAlert',
        );
      })
      .finally(() => {
        this.loaders.submitting = false;
      });
  }

  clickOnClose() {
    if (this.task.state === 'done') {
      this.goBack(false, null, true);
    } else {
      this.loaders.submitted = false;
    }
  }
}
