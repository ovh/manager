import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';

import { ORDER_PARAMETERS, RESOURCE_UPGRADE_TYPES } from './upgrade.constants';

export default class {
  /* @ngInject */
  constructor($http, $q, $translate, $window, OvhApiDedicatedCloud, User) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.$window = $window;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.User = User;
  }

  $onInit() {
    this.bindings = {
      isLoading: false,
    };

    return this.fetchInitialData();
  }

  fetchOVHSubsidiary() {
    return this.User.getUser().then(({ ovhSubsidiary }) => {
      this.ovhSubsidiary = ovhSubsidiary;
    });
  }

  fetchCatalog() {
    return this.$q
      .all({
        catalog: this.$http
          .get('/sws/dedicatedcloud/catalog', {
            serviceType: 'aapi',
            params: {
              ovhSubsidiary: this.ovhSubsidiary,
            },
          })
          .then((data) => get(data, 'data')),
        expressURL: this.User.getUrlOf('express_order'),
        service: this.OvhApiDedicatedCloud.v6().get({
          serviceName: this.productId,
        }).$promise,
        target: this.fetchTarget(),
      })
      .then(({ catalog, expressURL, service, target }) =>
        this.fetchServiceOptionPlanCode(target).then((planCode) => ({
          catalog,
          expressURL,
          service,
          planCode,
        })),
      )
      .then(({ catalog, expressURL, service, planCode }) => {
        this.expressURL = expressURL;
        this.service = service;

        this.plan = this.getPlanFromCatalog(planCode, catalog);

        [this.bindings.renewalPeriod] = this.plan.details.pricings[
          `${ORDER_PARAMETERS.pricingModePrefix}${service.servicePackName}`
        ];
      });
  }

  fetchServiceOptionPlanCode(target) {
    const targetPlanCode = target.profileCode || target.profile || null;
    const targetFamily = this.type;
    return this.$http
      .get(`/order/cartServiceOption/privateCloud/${this.productId}`)
      .then((data) => get(data, 'data'))
      .then((options) =>
        find(
          options,
          ({ planCode, family }) =>
            planCode.startsWith(targetPlanCode) && family === targetFamily,
        ),
      )
      .then(({ planCode }) => planCode);
  }

  fetchInitialData() {
    this.bindings.isLoading = true;

    return this.fetchOVHSubsidiary()
      .then(() => this.fetchCatalog())
      .catch(({ data }) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_order_loading_error',
          )} ${data.message || data}`,
          'danger',
        );
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }

  fetchTarget() {
    if (this.type === RESOURCE_UPGRADE_TYPES.host) {
      return this.OvhApiDedicatedCloud.Datacenter()
        .Host()
        .v6()
        .get({
          datacenterId: this.datacenterId,
          hostId: this.id,
          serviceName: this.productId,
        }).$promise;
    }

    return this.OvhApiDedicatedCloud.Filer()
      .v6()
      .get({
        filerId: this.id,
        serviceName: this.productId,
      })
      .$promise.catch(
        () =>
          this.OvhApiDedicatedCloud.Datacenter()
            .Filer()
            .v6()
            .get({
              datacenterId: this.datacenterId,
              filerId: this.id,
              serviceName: this.productId,
            }).$promise,
      );
  }

  getPlanFromCatalog(planCode, catalog) {
    let matchingPlan = null;
    get(catalog, 'plans', []).forEach((plan) => {
      if (plan && !matchingPlan) {
        const { addons } = find(plan.addonsFamily, {
          family: this.type,
        });
        if (addons) {
          const matchingAddon = head(
            filter(addons, (addon) => get(addon, 'plan.planCode') === planCode),
          );
          if (matchingAddon) {
            matchingPlan = matchingAddon.plan;
          }
        }
      }
    });
    return matchingPlan;
  }

  placeOrder() {
    const stringifiedExpressParameters = JSURL.stringify([
      {
        productId: ORDER_PARAMETERS.productId,
        serviceName: this.productId,
        planCode: this.plan.planCode,
        duration: ORDER_PARAMETERS.duration,
        pricingMode: `${ORDER_PARAMETERS.pricingModePrefix}${this.service.servicePackName}`,
        quantity: 1,
        configuration: [
          {
            label: ORDER_PARAMETERS.configurationItemLabels.datacenterId,
            value: this.datacenterId,
          },
          {
            label: ORDER_PARAMETERS.configurationItemLabels.hourlyId,
            value: this.id,
          },
        ],
      },
    ]);

    const window = this.$window.open();
    window.opener = null;
    window.location = `${this.expressURL}review?products=${stringifiedExpressParameters}`;
    window.target = '_blank';

    this.goBack();
  }
}
