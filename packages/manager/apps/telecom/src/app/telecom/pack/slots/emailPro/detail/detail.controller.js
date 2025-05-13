import { PACK_EMAILPRO } from '../emailPro.constant';

export default class PackEmailProDetailCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $state,
    $translate,
    OvhApiPackXdsl,
    OvhApiXdsl,
    TucToast,
    URLS,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiXdsl = OvhApiXdsl;
    this.PACK_EMAILPRO = PACK_EMAILPRO;
    this.URLS = URLS;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.askForDelete = false;
    this.accountDeleting = false;

    this.serviceName = this.$stateParams.serviceName;
    this.packName = this.$stateParams.packName;
    this.guideUrl = this.URLS.guides.xdsl.emailPro;

    this.loading = true;
    return this.$q
      .all([this.getAccount(), this.loadPackInfo()])
      .catch(() =>
        this.$state
          .go('telecom.packs.pack')
          .then(() =>
            this.TucToast.error(
              this.$translate.instant('email_pro_detail_loading_error'),
            ),
          ),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  loadPackInfo() {
    return this.OvhApiPackXdsl.Aapi()
      .get({ packId: this.$stateParams.packName })
      .$promise.then(({ general }) => {
        this.pack = general;
        return this.pack;
      });
  }

  getAccount() {
    return this.OvhApiXdsl.Email()
      .Pro()
      .v6()
      .get({ email: this.$stateParams.serviceName })
      .$promise.then((emailPro) => {
        this.account = emailPro;

        this.configuration = {
          status: {
            value: this.account.state,
            label:
              this.account.state === 'ok'
                ? this.$translate.instant('email_pro_detail_active')
                : this.$translate.instant('email_pro_detail_inactive'),
            icon:
              this.account.state === 'ok'
                ? 'ovh-font ovh-font-filled-check text-success'
                : 'ovh-font ovh-font-filled-error text-warning',
          },
          webmailUrl: this.PACK_EMAILPRO.webmailUrl,
        };
        return this.account;
      });
  }

  changePassword() {
    this.changingPassword = true;

    return this.OvhApiXdsl.Email()
      .Pro()
      .v6()
      .changePassword(
        {
          email: this.$stateParams.serviceName,
        },
        {
          password: this.password,
        },
      )
      .$promise.then(() => this.$state.go('telecom.packs.pack'))
      .then(() =>
        this.TucToast.success(
          this.$translate.instant('email_pro_detail_change_password_success', {
            email: this.$stateParams.serviceName,
          }),
        ),
      )
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('email_pro_detail_change_password_error'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.changingPassword = false;
      });
  }

  onDeleteAccountConfirmClick() {
    this.accountDeleting = true;

    return this.OvhApiXdsl.Email()
      .Pro()
      .v6()
      .delete({ email: this.$stateParams.serviceName })
      .$promise.then(() => this.$state.go('telecom.packs.pack'))
      .then(() =>
        this.TucToast.success(
          this.$translate.instant(
            'email_pro_detail_client_delete_account_success',
            { email: this.$stateParams.serviceName },
          ),
        ),
      )
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant(
            'email_pro_detail_client_delete_account_error',
          ),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.accountDeleting = false;
        this.askForDelete = false;
      });
  }
}
