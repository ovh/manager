angular.module('services').service(
  'HostingOptionOrder',
  class HostingOptionOrder {
    /**
     * Constructor
     * @param $http
     * @param $q
     * @param $stateParams
     * @param Hosting
     * @param OvhHttp
     * @param constants
     */
    constructor($http, $q, $stateParams, Hosting, OvhHttp, constants) {
      this.$http = $http;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.Hosting = Hosting;
      this.OvhHttp = OvhHttp;
      this.constants = constants;
      this.swsHostingOrderProxyPath = `${constants.swsProxyRootPath}order/hosting/web`;
    }

    /**
     * Check if sql perso can be ordered
     * @param option
     */
    isOptionOrderable(option, productId = this.$stateParams.productId) {
      return this.Hosting.getSelected(productId).then((hosting) =>
        this.$http
          .get(`${this.swsHostingOrderProxyPath}/${hosting.serviceName}`)
          .then(
            (response) =>
              !!(
                response &&
                response.data &&
                response.data.length &&
                response.data.indexOf(option) !== -1
              ),
          )
          .catch(() => false),
      );
    }

    /**
     * Get order enums
     * @param model
     */
    getOrderEnums(model) {
      return this.$http
        .get(`${this.constants.swsProxyRootPath}order.json`, { cache: true })
        .then((response) => {
          if (response.data && response.data.models) {
            return model
              ? response.data.models[model].enum
              : response.data.models;
          }
          return [];
        })
        .catch(() => []);
    }

    /**
     * Get sql perso duration for offer
     * @param option
     * @param params
     */
    getOrderDurations(option, params) {
      return this.Hosting.getSelected(this.$stateParams.productId).then(
        (hosting) =>
          this.$http
            .get(
              `${this.swsHostingOrderProxyPath}/${hosting.serviceName}/${option}`,
              { params },
            )
            .then((response) =>
              response && response.data && response.data.length
                ? response.data
                : [],
            )
            .catch((http) => this.$q.reject(http)),
      );
    }

    /**
     * Get order details for given duration and option (extraSqlPerso, ...)
     * @param option
     * @param duration
     * @param params
     */
    getOrderDetailsForDuration(option, duration, params) {
      return this.Hosting.getSelected(this.$stateParams.productId).then(
        (hosting) =>
          this.$http
            .get(
              `${this.swsHostingOrderProxyPath}/${hosting.serviceName}/${option}/${duration}`,
              { params },
            )
            .then((response) =>
              response && response.data ? response.data : {},
            )
            .catch((http) => this.$q.reject(http)),
      );
    }

    /**
     * Make an order
     * @param option
     * @param duration
     * @param params
     */
    makeOrder(option, duration, params) {
      return this.Hosting.getSelected(this.$stateParams.productId).then(
        (hosting) =>
          this.$http
            .post(
              `${this.swsHostingOrderProxyPath}/${hosting.serviceName}/${option}/${duration}`,
              params,
            )
            .then((response) =>
              response && response.data ? response.data : {},
            )
            .catch((http) => this.$q.reject(http)),
      );
    }
  },
);
