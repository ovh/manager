import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

export default class BillingMainPayAsYouGoCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    Alerter,
    OvhApiMe,
    OvhApiServices,
    ServicesHelper,
  ) {
    // injections
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiServices = OvhApiServices;
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
        services: this.OvhApiServices.v6().query().$promise,
      })
      .then(({ consumptions, services }) => {
        const projectPromises = map(consumptions, (consumption) => {
          const associatedService =
            find(services, {
              serviceId: consumption.serviceId,
            }) || {};

          return this.ServicesHelper.getServiceDetails(associatedService).then(
            (details) => {
              associatedService.details = details;
              set(consumption, 'service', associatedService);
            },
          );
        });

        return this.$q.all(projectPromises).then(() => consumptions);
      })
      .then((consumptions) => {
        this.consumptions = flatten(
          map(consumptions, (consumption) => {
            const consumptionProjectUrl = this.ServicesHelper.getServiceManageUrl(
              consumption.service,
            );

            return map(consumption.elements, (consumptionElement) => ({
              project: {
                name:
                  consumption.service.details.description ||
                  consumption.service.details.project_id,
                url: consumptionProjectUrl,
              },
              resource: consumptionElement.planCode,
              type: BillingMainPayAsYouGoCtrl.getConsumptionElementType(
                consumptionElement.planCode,
              ),
              dueDate: get(consumption.service, 'billing.nextBillingDate'),
              current: consumptionElement.price,
            }));
          }),
        );
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_main_pay_as_you_go_load_error'),
            get(error, 'data.message'),
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
