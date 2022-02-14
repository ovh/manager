import has from 'lodash/has';
import { HUBIC_LOGIN_URL, buildHubicVoucherURL } from './hubic.constants';

export default class PackHubicCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    iceberg,
    OvhApiPackXdslHubic,
    TucToast,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.OvhApiPackXdslHubic = OvhApiPackXdslHubic;
    this.TucToast = TucToast;
  }

  /**
   * Get detail of a domain voucher already used
   * @param  {string} domain
   */
  getVoucherDetails(domain) {
    return this.OvhApiPackXdslHubic.v6().getDomainDetails({
      packName: this.$stateParams.packName,
      domain,
    }).$promise;
  }

  /**
   * Load all hubic services
   * @return {Promise}
   */
  loadHubics() {
    const defaultEmail = this.$translate.instant(
      'pack_xdsl_hubic_used_email_unavailable',
    );

    this.loaders.services = true;
    this.services = [];

    return this.iceberg(
      `/pack/xdsl/${this.$stateParams.packName}/hubic/services`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data }) => data)
      .then((services) => {
        this.loaders.voucher = true;
        return this.$q.all(
          services.map((service) => {
            return service.isUsed
              ? this.getVoucherDetails(service.domain)
                  .then((voucherDetails) => {
                    let email = defaultEmail;
                    if (
                      ![400, 404].includes(voucherDetails.status) &&
                      has(voucherDetails.result, 'email')
                    ) {
                      email = voucherDetails.result.email;
                    }
                    return {
                      ...service,
                      email,
                      url: HUBIC_LOGIN_URL,
                    };
                  })
                  .catch(() => ({
                    ...service,
                    email: defaultEmail,
                    url: HUBIC_LOGIN_URL,
                  }))
              : this.$q.resolve({
                  ...service,
                  url: service.voucher
                    ? buildHubicVoucherURL(service.voucher)
                    : HUBIC_LOGIN_URL,
                });
          }),
        );
      })
      .then((services) => {
        this.services = services;
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant('pack_xdsl_hubic_loading_error')} ${
            err.message
          }`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.voucher = false;
        this.loaders.services = false;
      });
  }

  /**
   * Initialize controller
   */
  $onInit() {
    this.loaders = {
      services: true,
      voucher: false,
    };

    // Get service link to this access from current Pack Xdsl
    this.loadHubics();
  }
}
