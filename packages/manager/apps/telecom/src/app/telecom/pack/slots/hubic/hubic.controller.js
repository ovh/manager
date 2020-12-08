import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import map from 'lodash/map';
import times from 'lodash/times';

export default class PackHubicCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    OvhApiPackXdslHubic,
    TucToast,
    URLS,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiPackXdslHubic = OvhApiPackXdslHubic;
    this.TucToast = TucToast;
    this.URLS = URLS;
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
    this.loaders.services = true;
    this.services = [];

    return this.OvhApiPackXdslHubic.v7()
      .query()
      .aggregate('packName')
      .expand()
      .execute()
      .$promise.then((services) => {
        this.services = map(
          filter(services, (service) =>
            service.path.includes(this.$stateParams.packName),
          ),
          (service) => {
            const voucherUrl = `${this.URLS.hubicVoucher}?token=${get(
              service,
              'value.voucher',
            )}`;
            return assignIn(service, {
              url: get(service, 'value.voucher')
                ? voucherUrl
                : this.URLS.hubicLogin,
            });
          },
        );

        const servicesCodeUsed = filter(
          this.services,
          (service) => service.value.isUsed,
        );

        this.loaders.voucher = !!servicesCodeUsed.length;

        this.$q
          .allSettled(
            map(servicesCodeUsed, (service) =>
              this.getVoucherDetails(get(service, 'value.domain')),
            ),
          )
          .then((result) => result)
          .catch((result) => result)
          .then((result) => {
            times(result.length, (index) => {
              if (
                !includes([400, 404], get(result[index], 'status')) &&
                has(result[index].result, 'email')
              ) {
                servicesCodeUsed[index].value.email =
                  result[index].result.email;
              } else {
                servicesCodeUsed[index].value.email = this.$translate.instant(
                  'pack_xdsl_hubic_used_email_unavailable',
                );
              }
              servicesCodeUsed[index].url = this.URLS.hubicLogin;
            });
          })
          .finally(() => {
            this.loaders.voucher = false;
          });

        return this.services;
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
