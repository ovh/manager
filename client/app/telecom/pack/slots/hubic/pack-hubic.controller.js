angular.module('managerApp').controller('PackHubicCtrl', class {
  constructor($q, $stateParams, $translate, OvhApiPackXdslHubic, TucToast, URLS) {
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

    return this.OvhApiPackXdslHubic.v7().query().aggregate('packName').expand()
      .execute().$promise.then((services) => {
        this.services = _.chain(services)
          .filter(service => service.path.includes(this.$stateParams.packName))
          .map((service) => {
            const voucherUrl = `${this.URLS.hubicVoucher}?token=${_.get(service, 'value.voucher')}`;
            return _.extend(
              service,
              {
                url: _.get(service, 'value.voucher') ? voucherUrl : this.URLS.hubicLogin,
              },
            );
          }).value();

        const servicesCodeUsed = _.chain(this.services)
          .filter(service => service.value.isUsed).value();

        this.loaders.voucher = !!servicesCodeUsed.length;

        this.$q.allSettled(_.map(servicesCodeUsed, service => this.getVoucherDetails(_.get(service, 'value.domain'))))
          .then(result => result)
          .catch(result => result)
          .then((result) => {
            _.times(result.length, (index) => {
              if (result[index].status !== 404 && result[index].status !== 400) {
                servicesCodeUsed[index].value.email = result[index].result.email;
              } else {
                servicesCodeUsed[index].value.email = this.$translate.instant('pack_xdsl_hubic_used_email_unavailable');
              }
              servicesCodeUsed[index].url = this.URLS.hubicLogin;
            });
          })
          .finally(() => {
            this.loaders.voucher = false;
          });

        return this.services;
      }).catch((err) => {
        this.TucToast.error(`${this.$translate.instant('pack_xdsl_hubic_loading_error')} ${err.message}`);
        return this.$q.reject(err);
      }).finally(() => {
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
});
