import get from 'lodash/get';

export default class CdnUpdateSslCtrl {
  /* @ngInject */
  constructor($state, $stateParams, $translate, OvhApiCdn, Alerter) {
    // dependencies injections
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiCdn = OvhApiCdn;
    this.Alerter = Alerter;

    // controller attributes
    this.model = {
      certificate: null,
      key: null,
      chain: null,
    };

    this.loading = {
      init: false,
      update: false,
    };

    this.ssl = null;
    this.actionEnabled = true;
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onCdnSslUpdateFormSubmit() {
    if (this.cdnSslUpdateForm.$invalid) {
      return false;
    }
    if (!this.actionEnabled) {
      return this.$state.go('^');
    }

    this.loading.update = true;

    return this.OvhApiCdn.Dedicated()
      .Ssl()
      .v6()
      .update(
        {
          serviceName: this.$stateParams.productId,
        },
        this.model,
      )
      .$promise.then(() => {
        this.Alerter.success(
          this.$translate.instant('cdn_dedicated_ssl_update_success'),
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
            this.$translate.instant('cdn_dedicated_ssl_update_error'),
            get(error, 'data.message'),
          ].join(' '),
          'cdnDedicatedManage',
        );
        this.$state.go('^');
      })
      .finally(() => {
        this.loading.update = false;
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
            this.$translate.instant('cdn_dedicated_ssl_update_load_error'),
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
