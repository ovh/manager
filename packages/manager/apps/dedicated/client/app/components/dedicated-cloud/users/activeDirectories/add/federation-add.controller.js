import {
  DEFAULT_LDAP_TCP_PORT,
  FIELD_NAME,
  GUIDE_FEDERATION,
  PLACEHOLDER,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
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
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;

    this.guideFederationLink =
      GUIDE_FEDERATION[this.user.ovhSubsidiary] || GUIDE_FEDERATION.DEFAULT;

    this.model = {
      domainName: null,
      domainAlias: null,
      description: null,
      ip: null,
      ldapHostname: null,
      ldapTcpPort: DEFAULT_LDAP_TCP_PORT,
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
    this.trackClick(`${TRACKING_PREFIX}::confirm`);
    this.loaders.submitting = true;

    if (!this.model.ldapTcpPort) {
      this.model.ldapTcpPort = DEFAULT_LDAP_TCP_PORT;
    }

    return this.DedicatedCloud.postActiveDirectories(this.productId, this.model)
      .then((data) => {
        this.loaders.submitted = true;
        this.loaders.action = true;
        this.task = data;
      })
      .catch(({ data: err }) => {
        this.trackPage(`${TRACKING_PREFIX}-error`);
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

  onCloseClick() {
    this.trackClick(`${TRACKING_PREFIX}::done`);
    if (this.task.state === 'done') {
      this.goBack(false, null, true);
    } else {
      this.loaders.submitted = false;
    }
  }

  onGoBackClick() {
    this.trackClick(`${TRACKING_PREFIX}::back`);
    return this.goBack();
  }
}
