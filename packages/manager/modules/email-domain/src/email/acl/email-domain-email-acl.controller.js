import { LANGUAGES } from '@ovh-ux/manager-config';
import endsWith from 'lodash/endsWith';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default class EmailDomainEmailAclCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    goToEmail,
    WucEmails,
    WucUser,
    constants,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.goToEmail = goToEmail;
    this.WucEmails = WucEmails;
    this.LANGUAGES = LANGUAGES;
    this.WucUser = WucUser;
    this.constants = constants;
  }

  $onInit() {
    this.aclsDetails = [];
    this.addAclItem = { value: '' };
    this.addingAcl = false;
    this.createNicUrl = { value: '' };
    this.loading = {
      acls: false,
    };

    this.WucUser.getUser()
      .then((user) => {
        const nicLanguage = find(this.LANGUAGES, (language) =>
          endsWith(language.value, user.ovhSubsidiary),
        );
        if (nicLanguage) {
          this.createNicUrl.value = this.constants.WEBSITE_URLS.new_nic[
            nicLanguage.value
          ];
        }
      })
      .catch(() => {
        this.createNicUrl.value = '';
      });

    this.$scope.$on('hosting.tabs.emails.acls.refresh', () =>
      this.refreshTableAcls(),
    );

    this.refreshTableAcls();
  }

  addAcl() {
    this.loading.acls = true;
    this.WucEmails.createAcl(this.$stateParams.productId, this.addAclItem.value)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('email_tab_table_acls_add_success'),
          this.$scope.alerts.main,
        );
        this.refreshTableAcls();
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_acls_add_error'),
          err,
          this.$scope.alerts.main,
        );
        this.loading.acls = false;
      })
      .finally(() => {
        this.addAclItem.value = '';
        this.addingAcl = false;
      });
  }

  refreshTableAcls(forceRefresh) {
    this.loading.acls = true;
    this.acls = null;

    return this.WucEmails.getAcls(this.$stateParams.productId, forceRefresh)
      .then((acls) => {
        this.acls = acls;
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_acls_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        if (isEmpty(this.acls)) {
          this.loading.acls = false;
        }
      });
  }

  transformItem(item) {
    return this.WucEmails.getAcl(this.$stateParams.productId, item);
  }

  onTransformItemDone() {
    this.loading.acls = false;
  }
}
