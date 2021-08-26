import find from 'lodash/find';
import isFunction from 'lodash/isFunction';
import orderBy from 'lodash/orderBy';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';
import { CATALOG_PRODUCT } from './private-database.constant';

export default class OrderPrivateDatabaseServiceCtrl {
  /* @ngInject */
  constructor($q, $timeout, $translate, $window, OrderPrivateDatabaseService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.OrderPrivateDatabaseService = OrderPrivateDatabaseService;
    this.CATALOG_PRODUCT = CATALOG_PRODUCT;
  }

  $onInit() {
    this.catalog = null;
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      user: this.user,
      workflowOptions: {
        catalog: this.catalog,
        catalogItemTypeName: workflowConstants.CATALOG_ITEM_TYPE_NAMES.PLAN,
        productName: CATALOG_PRODUCT.name,
        getPlanCode: this.getPlanCode.bind(this),
        onGetConfiguration: () => this.getConfiguration(),
      },
      workflowType: workflowConstants.WORKFLOW_TYPES.ORDER,
    };

    // select privateSQL by default
    this.order = {
      datacenter: this.datacenter,
      type: CATALOG_PRODUCT.name,
    };

    this.loadingDependencies = true;
    this.$q
      .all({
        services: this.OrderPrivateDatabaseService.getServices(),
        dependencies: this.loadDependencies(),
      })
      .then(({ services }) => {
        this.services = services;
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => {
        this.loadingDependencies = false;
      });
  }

  loadDependencies() {
    return this.OrderPrivateDatabaseService.getCatalog(this.user.ovhSubsidiary)
      .then((catalog) => {
        this.catalog = catalog;
        this.productOffers.workflowOptions.catalog = this.catalog;
        return this.OrderPrivateDatabaseService.getProducts(catalog);
      })
      .then((products) => {
        this.products = products;
        this.catalogProducts = this.OrderPrivateDatabaseService.constructor.getCatalogProducts(
          this.catalog,
          products,
        );
        return true;
      });
  }

  getVersions(product) {
    this.catalogProduct = find(this.catalogProducts, {
      planCode: product.planCode,
    });
    const engines = find(this.catalogProduct.configurations, {
      name: 'engine',
    });

    if (!engines || !engines.values) {
      return [];
    }

    return orderBy(
      engines.values.sort().map((engine) => {
        const [engineLabel, engineVersion] = engine.split('_');
        const name = this.$translate.instant(
          `hosting_database_order_private_version_${engineLabel}`,
          { version: engineVersion },
        );

        return {
          name,
          value: engine,
          engineLabel,
          engineVersion: parseFloat(engineVersion),
        };
      }),
      ['engineLabel', 'engineVersion'],
      ['asc', 'desc'],
    );
  }

  onServiceChange(serviceName) {
    this.loadingDatacenter = true;
    this.order.datacenter = null;
    this.getDatacenter(serviceName)
      .then((datacenter) => {
        this.order.datacenter = datacenter;
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => {
        this.loadingDatacenter = false;
      });
  }

  onProductChange(product) {
    this.product = product;
    this.versions = this.getVersions(product);
  }

  getDatacenter(serviceName) {
    return this.OrderPrivateDatabaseService.getDatacenter(serviceName);
  }

  cancel() {
    if (this.onCancel && isFunction(this.onCancel)) {
      this.onCancel();
    }
  }

  handleSuccess(order) {
    this.$window.open(order.url, '_blank');
    if (this.onSuccess && isFunction(this.onSuccess)) {
      this.onSuccess({ url: order.url });
    }
  }

  handleError(error) {
    if (this.onError && isFunction(this.onError)) {
      this.onError({ error });
    }
  }

  getPlanCode() {
    return this.product.planCode;
  }

  getConfiguration() {
    const conf = [
      {
        label: 'dc',
        value: this.order.datacenter,
      },
      {
        label: 'engine',
        value: this.order.version.value,
      },
    ];
    return conf;
  }
}
