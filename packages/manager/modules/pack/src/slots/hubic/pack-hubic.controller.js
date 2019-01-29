import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiPackXdslHubic,
    TucToast,
    PACK_SLOTS_HUBIC_LOGIN_URL,
    PACK_SLOTS_HUBIC_VOUCHER_URL,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiPackXdslHubic = OvhApiPackXdslHubic;
    this.TucToast = TucToast;
    this.PACK_SLOTS_HUBIC_LOGIN_URL = PACK_SLOTS_HUBIC_LOGIN_URL;
    this.PACK_SLOTS_HUBIC_VOUCHER_URL = PACK_SLOTS_HUBIC_VOUCHER_URL;
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

  /**
   * Get detail of a domain voucher already used
   * @param  {string} domain
   */
  getVoucherDetails(domain) {
    return this.OvhApiPackXdslHubic
      .v6()
      .getDomainDetails({
        packName: this.pack.packName,
        domain,
      })
      .$promise;
  }

  /**
   * Load all hubic services
   * @return {Promise}
   */
  loadHubics() {
    this.loaders.services = true;
    this.services = [];

    return this.OvhApiPackXdslHubic
      .v7()
      .query()
      .aggregate('packName').expand()
      .execute()
      .$promise
      .then((services) => {
        this.services = _.chain(services)
          .filter(service => service.path.includes(this.pack.packName))
          .map((service) => {
            const voucherUrl = `${this.PACK_SLOTS_HUBIC_VOUCHER_URL}?token=${_.get(service, 'value.voucher')}`;
            return _.extend(
              service,
              {
                url: _.get(service, 'value.voucher') ? voucherUrl : this.PACK_SLOTS_HUBIC_LOGIN_URL,
              },
            );
          }).value();

        const servicesCodeUsed = _.filter(this.services, service => service.value.isUsed);

        this.loaders.voucher = !!servicesCodeUsed.length;

        this.$q.allSettled(
          _.map(servicesCodeUsed, service => this.getVoucherDetails(_.get(service, 'value.domain'))),
        )
          .then(result => result)
          .catch(result => result)
          .then((result) => {
            _.times(result.length, (index) => {
              if (result[index].status !== 404 && result[index].status !== 400) {
                servicesCodeUsed[index].value.email = result[index].result.email;
              } else {
                servicesCodeUsed[index].value.email = this.$translate.instant('pack_xdsl_hubic_used_email_unavailable');
              }
              servicesCodeUsed[index].url = this.PACK_SLOTS_HUBIC_LOGIN_URL;
            });
          })
          .finally(() => {
            this.loaders.voucher = false;
          });

        return this.services;
      })
      .catch((err) => {
        this.TucToast.error(`${this.$translate.instant('pack_xdsl_hubic_loading_error')} ${err.message}`);
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.services = false;
      });
  }
};
