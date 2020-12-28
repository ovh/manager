import assign from 'lodash/assign';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';

class LicenseAgoraOrder {
  constructor($http, $q, $translate, Alerter, coreConfig, OvhHttp, User) {
    this.$http = $http;
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
    return this.User.getUser().then((user) =>
      this.OvhHttp.get('/order/catalog/formatted/{catalogName}', {
        rootPath: 'apiv6',
        urlParams: {
          catalogName: this.licenseTypeToCatalog[licenseType],
        },
        params: {
          ovhSubsidiary: get(
            user,
            'ovhSubsidiary',
            this.coreConfig.getRegion(),
          ),
        },
      }).then((data) => data.plans),
    );
  }

  getdAddons(productType) {
    return this.OvhHttp.get(`/order/cartServiceOption/${productType}`, {
      rootPath: 'apiv6',
    });
  }

  getAddon({ productType, serviceName }) {
    return this.OvhHttp.get(
      `/order/cartServiceOption/${productType}/{serviceName}`,
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  addAddon({
    productType,
    serviceName,
    cartId,
    duration,
    planCode,
    pricingMode,
    quantity,
  }) {
    return this.OvhHttp.post(
      `/order/cartServiceOption/${productType}/{serviceName}`,
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          cartId,
          duration,
          planCode,
          pricingMode,
          quantity,
        },
      },
    );
  }

  getLicenseOfferPlan(licenseType, planCode, ip) {
    return this.getLicenseOffers(licenseType).then((plans) => {
      const plan = assign(
        {},
        find(plans, (planItem) => planItem.planCode === planCode),
      );
      plan.getPrice = (
        config = {
          options: [],
          duration: 1,
        },
      ) => {
        set(config, 'planCode', planCode);
        set(config, 'ip', ip);
        return this.getPlanPrice(config);
      };
      return plan;
    });
  }

  getPlanPrice(config) {
    let cartId = '';

    return this.User.getUser().then((user) =>
      this.OvhHttp.post('/order/cart', {
        rootPath: 'apiv6',
        data: {
          ovhSubsidiary: get(
            user,
            'ovhSubsidiary',
            this.coreConfig.getRegion(),
          ),
        },
      })
        .then((data) => {
          cartId = get(data, 'cartId');
          return this.OvhHttp.post('/order/cart/{cartId}/assign', {
            rootPath: 'apiv6',
            urlParams: { cartId },
          });
        })
        .then(() => this.pushAgoraPlan({ cartId, config }))
        .then((plan) =>
          this.configureIpField({
            cartId,
            itemId: plan.itemId,
            ip: config.ip,
          }).then(() => plan),
        )
        .then((plan) =>
          this.$q.all(
            map(config.options, (option) =>
              this.pushAgoraPlan({
                cartId,
                config: assign({}, config, {
                  planCode: option,
                  options: [],
                  itemId: plan.itemId,
                }),
                path: `/order/cart/{cartId}/${
                  this.licenseTypeToCatalog[config.licenseType]
                }/options`,
                urlParams: { cartId },
              }),
            ),
          ),
        )
        .then(() =>
          this.OvhHttp.get('/order/cart/{cartId}/checkout', {
            rootPath: 'apiv6',
            urlParams: { cartId },
          }),
        )
        .finally(() => this.$http.delete(`/order/cart/${cartId}`)),
    );
  }

  pushAgoraPlan(params) {
    set(params, 'path', params.path || '/order/cart/{cartId}/{productId}');
    set(
      params,
      'urlParams',
      params.urlParams || {
        cartId: params.cartId,
        productId: this.licenseTypeToCatalog[params.config.licenseType],
      },
    );

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
    return this.OvhHttp.post(
      '/order/cart/{cartId}/item/{itemId}/configuration',
      {
        rootPath: 'apiv6',
        urlParams: {
          cartId,
          itemId,
        },
        data: {
          label: 'ip',
          value: ip,
        },
      },
    );
  }

  getFinalizeOrderUrl(licenseInfo) {
    const productToOrder = this.getExpressOrderData(licenseInfo);
    return this.User.getUrlOf('express_order_resume')
      .then((url) => `${url}?products=${JSURL.stringify([productToOrder])}`)
      .catch((err) => {
        this.Alerter.error(this.$translate.instant('ip_order_finish_error'));
        return this.$q.reject(err);
      });
  }

  getExpressOrderData(licenseInfo) {
    const options = [];
    forEach(keys(licenseInfo.options), (key) => {
      if (get(licenseInfo.options[key], 'value')) {
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
          values: [licenseInfo.ip],
        },
      ],
    };

    if (options.length) {
      productToOrder.option = options;
    }

    return productToOrder;
  }
}

angular
  .module('Module.license')
  .service('LicenseAgoraOrder', LicenseAgoraOrder);
