export default class BillingMainPayAsYouGoCtrl {
  /* @ngInject */
  constructor($q, $translate, Alerter, OvhApiMe, iceberg, ServicesHelper) {
    // injections
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiMe = OvhApiMe;
    this.iceberg = iceberg;
    this.ServicesHelper = ServicesHelper;

    // other attributes
    this.loading = {
      init: false,
    };

    this.consumptions = null;
  }

  static getConsumptionElementType(planCode) {
    if (planCode.indexOf('snapshot') > -1) {
      return 'snapshot';
    }
    if (planCode.indexOf('volume') > -1) {
      return 'volume';
    }

    return 'instance';
  }

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
   * This is done for pci projects only. Good luck to implement the rest :-)
   * More seriously, the major part of the code will be removed when other service types
   * will be taken in consideration.
   */
  $onInit() {
    this.loading.init = true;

    return this.$q
      .all({
        consumptions: this.OvhApiMe.v6().consumption().$promise,
        services: this.iceberg('/services')
          .query()
          .expand('CachedObjectList-Pages')
          .execute().$promise,
      })
      .then(({ consumptions = [], services: { data: services = [] } }) => {
        const projectPromises = consumptions.map((consumption) => {
          const formattedConsumption = {
            ...consumption,
            service:
              services.find(
                ({ serviceId }) => serviceId === consumption.serviceId,
              ) || {},
          };

          return this.ServicesHelper.getServiceDetails(
            formattedConsumption.service,
          )
            .then((details) => {
              formattedConsumption.service.details = details;
              return formattedConsumption;
            })
            .catch(() => formattedConsumption);
        });

        return this.$q.all(projectPromises);
      })
      .then((consumptions) => {
        this.consumptions = consumptions
          .map((consumption) => {
            const consumptionProjectUrl = this.ServicesHelper.getServiceManageUrl(
              consumption.service,
            );

            return consumption.elements.map((consumptionElement) => ({
              project: {
                name:
                  consumption.service?.details?.description ||
                  // eslint-disable-next-line camelcase
                  consumption.service?.details?.project_id,
                url: consumptionProjectUrl,
              },
              resource: consumptionElement.planCode,
              type: BillingMainPayAsYouGoCtrl.getConsumptionElementType(
                consumptionElement.planCode,
              ),
              dueDate: consumption.service?.billing?.nextBillingDate,
              current: consumptionElement.price,
            }));
          })
          .flat();
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_main_pay_as_you_go_load_error'),
            error?.data?.message || error?.message,
          ].join(' '),
          'billing_main_alert',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
