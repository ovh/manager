import get from 'lodash/get';

export default class CdnDeleteSslCtrl {
  /* @ngInject */
  constructor($state, $stateParams, $translate, OvhApiCdn, Alerter) {
    // dependencies injections
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiCdn = OvhApiCdn;
    this.Alerter = Alerter;

    // controller attributes
    this.loading = {
      init: false,
      delete: false,
    };

    this.ssl = null;
    this.actionEnabled = true;
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPrimaryActionBtnClick() {
    if (!this.actionEnabled) {
      return this.$state.go('^');
    }

    this.loading.delete = true;

    return this.OvhApiCdn.Dedicated()
      .Ssl()
      .v6()
      .remove(
        {
          serviceName: this.$stateParams.productId,
        },
        this.model,
      )
      .$promise.then(() => {
        this.Alerter.success(
          this.$translate.instant('cdn_dedicated_ssl_delete_success'),
          'cdnDedicatedManage',
        );
        this.$state.go(
          '^',
          {},
          {
            reload: true,
          },
        );
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('cdn_dedicated_ssl_delete_error', {
              t0: get(this.ssl, 'name', ''),
            }),
            get(error, 'data.message'),
          ].join(' '),
          'cdnDedicatedManage',
        );
        this.$state.go('^');
      })
      .finally(() => {
        this.loading.delete = false;
      });
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.OvhApiCdn.Dedicated()
      .Ssl()
      .v6()
      .get({
        serviceName: this.$stateParams.productId,
      })
      .$promise.then((ssl) => {
        this.ssl = ssl;
        this.actionEnabled =
          this.ssl.status === 'on' || this.ssl.status === 'off';
      })
      .catch((error) => {
        if (get(error, 'status') === 404) {
          this.actionEnabled = false;
          return null;
        }

        return this.Alerter.error(
          [
            this.$translate.instant('cdn_dedicated_ssl_add_load_error'),
            get(error, 'data.message'),
          ].join(' '),
          'cdnDedicatedManage',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
