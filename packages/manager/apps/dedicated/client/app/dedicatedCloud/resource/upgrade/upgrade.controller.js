import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';

import { ORDER_PARAMETERS, RESOURCE_UPGRADE_TYPES } from './upgrade.constants';

export const controller = class {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $scope,
    $stateParams,
    $translate,
    $window,
    Alerter,
    OvhApiDedicatedCloud,
    User,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
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
          serviceName: this.$stateParams.productId,
        }).$promise,
        target: this.fetchTarget(),
      })
      .then(({ catalog, expressURL, service, target }) => {
        this.expressURL = expressURL;
        this.service = service;

        this.plan = this.getPlanFromCatalog(target, catalog);

        [this.bindings.renewalPeriod] = this.plan.details.pricings[
          `${ORDER_PARAMETERS.pricingModePrefix}${service.servicePackName}`
        ];
      });
  }

  fetchInitialData() {
    this.bindings.isLoading = true;

    return this.fetchOVHSubsidiary()
      .then(() => this.fetchCatalog())
      .catch(({ data }) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('dedicatedCloud_order_loading_error'),
          data,
        );
        this.$scope.$dismiss();
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }

  fetchTarget() {
    if (this.$stateParams.type === RESOURCE_UPGRADE_TYPES.host) {
      return this.OvhApiDedicatedCloud.Datacenter()
        .Host()
        .v6()
        .get({
          datacenterId: this.$stateParams.datacenterId,
          hostId: this.$stateParams.id,
          serviceName: this.$stateParams.productId,
        }).$promise;
    }

    return this.OvhApiDedicatedCloud.Filer()
      .v6()
      .get({
        filerId: this.$stateParams.id,
        serviceName: this.$stateParams.productId,
      })
      .$promise.catch(
        () =>
          this.OvhApiDedicatedCloud.Datacenter()
            .Filer()
            .v6()
            .get({
              datacenterId: this.$stateParams.datacenterId,
              filerId: this.$stateParams.id,
              serviceName: this.$stateParams.productId,
            }).$promise,
      );
  }

  getPlanFromCatalog(target, catalog) {
    return head(
      filter(
        find(catalog.plans[0].addonsFamily, { family: this.$stateParams.type })
          .addons,
        (addon) =>
          addon.plan.planCode === target.profileCode ||
          addon.plan.planCode === target.profile,
      ),
    ).plan;
  }

  placeOrder() {
    const stringifiedExpressParameters = JSURL.stringify([
      {
        productId: ORDER_PARAMETERS.productId,
        serviceName: this.$stateParams.productId,
        planCode: this.plan.planCode,
        duration: ORDER_PARAMETERS.duration,
        pricingMode: `${ORDER_PARAMETERS.pricingModePrefix}${this.service.servicePackName}`,
        quantity: 1,
        configuration: [
          {
            label: ORDER_PARAMETERS.configurationItemLabels.datacenterId,
            value: this.$stateParams.datacenterId,
          },
          {
            label: ORDER_PARAMETERS.configurationItemLabels.hourlyId,
            value: this.$stateParams.id,
          },
        ],
      },
    ]);

    const window = this.$window.open();
    window.opener = null;
    window.location = `${this.expressURL}review?products=${stringifiedExpressParameters}`;
    window.target = '_blank';

    this.$scope.$dismiss();
  }
};

export const controllerName = 'ovhManagerPccResourceUpgrade';

export default {
  controller,
  controllerName,
};
