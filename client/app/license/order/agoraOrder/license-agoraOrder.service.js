class LicenseAgoraOrder {
  constructor(
    $q,
    $translate,
    Alerter,
    coreConfig,
    OvhHttp,
    User,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
    this.OvhHttp = OvhHttp;
    this.User = User;

    this.licenseTypeToCatalog = {
      CLOUDLINUX: 'licenseCloudLinux',
      CPANEL: 'licensecPanel',
      DIRECTADMIN: 'licenseDirectadmin',
      PLESK: 'licensePlesk',
      SQLSERVER: 'licenseSqlServer',
      VIRTUOZZO: 'licenseVirtuozzo',
      WINDOWS: 'licenseWindows',
      WORKLIGHT: 'licenseWorklight',
    };
  }

  getLicenseOffers(licenseType) {
    return this.OvhHttp.get('/order/catalog/formatted/{catalogName}', {
      rootPath: 'apiv6',
      urlParams: {
        catalogName: this.licenseTypeToCatalog[licenseType],
      },
      params: {
        ovhSubsidiary: this.coreConfig.getRegion(),
      },
    }).then(data => data.plans);
  }

  getLicenseOfferPlan(licenseType, planCode, ip) {
    return this.getLicenseOffers(licenseType).then((plans) => {
      const plan = _.assign({}, _.find(plans, planItem => planItem.planCode === planCode));
      plan.getPrice = (
        config = {
          options: [],
          duration: 1,
        },
      ) => {
        _.set(config, 'planCode', planCode);
        _.set(config, 'ip', ip);
        return this.getPlanPrice(config);
      };
      return plan;
    });
  }

  getPlanPrice(config) {
    let cartId = '';

    return this.OvhHttp.post('/order/cart', { rootPath: 'apiv6', data: { ovhSubsidiary: this.coreConfig.getRegion() } })
      .then((data) => {
        cartId = _.get(data, 'cartId');
        return this.OvhHttp.post('/order/cart/{cartId}/assign', { rootPath: 'apiv6', urlParams: { cartId } });
      })
      .then(() => this.pushAgoraPlan({ cartId, config }))
      .then(plan => this.configureIpField({
        cartId,
        itemId: plan.itemId,
        ip: config.ip,
      }).then(() => plan))
      .then(plan => this.$q.all(
        _.map(config.options, option => this.pushAgoraPlan({
          cartId,
          config: _.assign({}, config, { planCode: option, options: [], itemId: plan.itemId }),
          path: `/order/cart/{cartId}/${this.licenseTypeToCatalog[config.licenseType]}/options`,
          urlParams: { cartId },
        })),
      ))
      .then(() => this.OvhHttp.get('/order/cart/{cartId}/checkout', { rootPath: 'apiv6', urlParams: { cartId } }))
      .finally(() => this.OvhHttp.delete('/order/cart/{cartId}', { rootPath: 'apiv6', urlParams: { cartId } }));
  }

  pushAgoraPlan(params) {
    _.set(params, 'path', params.path || '/order/cart/{cartId}/{productId}');
    _.set(params, 'urlParams', params.urlParams || {
      cartId: params.cartId,
      productId: this.licenseTypeToCatalog[params.config.licenseType],
    });

    const payload = {
      rootPath: 'apiv6',
      urlParams: params.urlParams,
      data: {
        duration: `P${params.config.duration}M`,
        planCode: params.config.planCode,
        pricingMode: 'default',
        quantity: 1,
      },
    };

    if (params.config.itemId) {
      payload.data.itemId = params.config.itemId;
    }

    return this.OvhHttp.post(params.path, payload);
  }

  configureIpField({ cartId, itemId, ip }) {
    return this.OvhHttp.post('/order/cart/{cartId}/item/{itemId}/configuration', {
      rootPath: 'apiv6',
      urlParams: {
        cartId,
        itemId,
      },
      data: {
        label: 'ip',
        value: ip,
      },
    });
  }

  getFinalizeOrderUrl(licenseInfo) {
    const productToOrder = this.getExpressOrderData(licenseInfo);
    return this.User.getUrlOf('express_order')
      .then(url => `${url}review?products=${JSURL.stringify([productToOrder])}`)
      .catch((err) => {
        this.Alerter.error(this.$translate.instant('ip_order_finish_error'));
        return this.$q.reject(err);
      });
  }

  getExpressOrderData(licenseInfo) {
    const options = [];
    _.forEach(_.keys(licenseInfo.options), (key) => {
      if (_.get(licenseInfo.options[key], 'value')) {
        options.push({
          planCode: licenseInfo.options[key].value,
          duration: `P${licenseInfo.duration}M`,
          pricingMode: 'default',
          quantity: 1,
        });
      }
    });

    const productToOrder = {
      planCode: licenseInfo.version,
      productId: this.licenseTypeToCatalog[licenseInfo.licenseType],
      duration: `P${licenseInfo.duration}M`,
      pricingMode: 'default',
      quantity: licenseInfo.quantity || 1,
      configuration: [
        {
          label: 'ip',
          value: licenseInfo.ip,
        },
      ],
    };

    if (options.length) {
      productToOrder.option = options;
    }

    return productToOrder;
  }
}

angular.module('Module.license').service('LicenseAgoraOrder', LicenseAgoraOrder);
