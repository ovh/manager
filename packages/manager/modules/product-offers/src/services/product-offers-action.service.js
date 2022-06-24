import camelCase from 'lodash/camelCase';

/**
 * Service to handle option action through /services route, for a given service
 * Action can be 'detach' or 'upgrade'
 */
export default class ProductOffersActionService {
  /* @ngInject */
  constructor($http, OVH_PAYMENT_METHOD_TYPE) {
    this.$http = $http;
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;
  }

  /**
   * Retrieve all available detach plancodes
   * @param  {string} serviceId Id of the service
   * @return {Promise<Array>}   Promise of the plancodes list
   */
  getAvailableDetachPlancodes(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/detach`)
      .then(({ data }) => data);
  }

  /**
   * Get the detach plancode information
   * @param  {string} planCode  Plancode identifier
   * @param  {string} serviceId Id of the service
   * @return {Promise<Object>}  Promise of the plancode details
   */
  getDetachPlancodeInformation(planCode, serviceId) {
    return this.$http
      .get(`/services/${serviceId}/detach/${planCode}`)
      .then(({ data }) => data);
  }

  /**
   * Get the detach plancode information for its options (addons)
   * @param  {string} planCode  Plancode identifier
   * @param  {string} serviceId Id of the service
   * @return {Promise<Object>}  Promise of the addon detach details
   */
  getDetachPlancodeInformationOptions(serviceId, planCode) {
    return this.$http
      .get(`/services/${serviceId}/detach/${planCode}/options`)
      .then(({ data }) => data);
  }

  /**
   * Retrieve all available options for a given service
   * @param  {string} serviceId Id of the service
   * @return {Promise<Array>}   Promise of the plancodes list
   */
  getAvailableOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/options`)
      .then(({ data }) => data);
  }

  /**
   * Retrieve all available upgrade plancodes
   * @param  {string} serviceId Id of the service
   * @return {Promise<Array>}   Promise of the plancodes list
   */
  getAvailableUpgradePlancodes(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  /**
   * Get the upgrade plancode information
   * @param  {string} planCode  Plancode identifier
   * @param  {string} serviceId Id of the service
   * @return {Promise<Object>}  Promise of the plancodes list
   */
  getAvailableUpgradeInformation(planCode, serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade/${planCode}`)
      .then(({ data }) => data);
  }

  /**
   * Execute an action for a given option, for a given service
   * @param  {string} planCode       Plancode identifier
   * @param  {string} serviceId      Id of the service
   * @param  {string} type           Action type (detach, upgrade)
   * @param  {Object} executeOptions Options to execute option
   * @return {Promise}               Promise of the executed action
   */
  execute(planCode, serviceId, type, executeOptions) {
    return this.$http
      .post(
        `/services/${serviceId}/${type}/${planCode}/execute`,
        executeOptions,
      )
      .then(({ data }) => data);
  }

  /**
   * Simulate an action to get its pricing information
   * @param  {string} planCode        Plancode identifier
   * @param  {string} serviceId       Id of the service
   * @param  {string} type            Action type (detach, upgrade)
   * @param  {Object} simulateOptions Simulation options
   * @return {Promise}                Promise of the simulated action
   */
  simulate(planCode, serviceId, type, simulateOptions) {
    return this.$http
      .post(
        `/services/${serviceId}/${type}/${planCode}/simulate`,
        simulateOptions,
      )
      .then(({ data }) => data);
  }

  /**
   * Execute the payment to validate the action
   * @param  {Order}   order         Order identifier
   * @param  {string}  paymentMethod Payment method to use
   * @return {Promise}               Promise of the payment
   */
  pay(order, paymentMethod) {
    const paymentParameters =
      order.prices.withTax.value === 0
        ? {
            paymentMean: 'fidelityAccount',
          }
        : {
            paymentMean: paymentMethod.paymentType,
          };

    if (
      [
        this.OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT,
        this.OVH_PAYMENT_METHOD_TYPE.CREDIT_CARD,
        this.OVH_PAYMENT_METHOD_TYPE.PAYPAL,
      ].includes(paymentParameters.paymentMean)
    ) {
      paymentParameters.paymentMean = camelCase(paymentMethod.paymentType);
      paymentParameters.paymentMeanId = paymentMethod.paymentMeanId;
    }

    return this.$http
      .post(
        `/me/order/${order.orderId}/payWithRegisteredPaymentMean`,
        paymentParameters,
      )
      .then(({ data }) => data);
  }
}
