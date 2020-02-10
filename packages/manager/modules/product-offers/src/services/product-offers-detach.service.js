/**
 * Service to handle option detachment for a given service
 */
export default class ProductOffersDetachService {
  /* @ngInject */
  constructor(OvhApiMe, OvhApiServices, OVH_PAYMENT_METHOD_TYPE) {
    this.orderService = OvhApiMe.Order().v6();
    this.detachService = OvhApiServices.Detach().v6();
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;
  }

  /**
   * Retrieve all available detach plancodes
   * @param  {string} serviceId Id of the service
   * @return {Promise<Array>}   Promise of the plancodes list
   */
  getAvailableDetachPlancodes(serviceId) {
    return this.detachService.query({
      serviceId,
    }).$promise;
  }

  /**
   * Get the detach plancode information
   * @param  {string} planCode  Plancode identifier
   * @param  {string} serviceId Id of the service
   * @return {Promise<Object>}  Promise of the plancode details
   */
  getDetachPlancodeInformation(planCode, serviceId) {
    return this.detachService.get({
      planCode,
      serviceId,
    }).$promise;
  }

  /**
   * Execute a detach for a given option, for a given service
   * @param  {string} planCode       Plancode identifier
   * @param  {string} serviceId      Id of the service
   * @param  {Object} executeOptions Options to execute option
   * @return {Promise}               Promise of the executed detach
   */
  executeDetach(planCode, serviceId, executeOptions) {
    return this.detachService.execute(
      {
        planCode,
        serviceId,
      },
      executeOptions,
    ).$promise;
  }

  /**
   * Simulate a detach to have all the information about
   * @param  {string} planCode        Plancode identifier
   * @param  {string} serviceId       Id of the service
   * @param  {Object} simulateOptions Simulation options
   * @return {Promise}                Promise of the simulated detach
   */
  simulateDetach(planCode, serviceId, simulateOptions) {
    return this.detachService.simulate(
      {
        planCode,
        serviceId,
      },
      simulateOptions,
    ).$promise;
  }

  /**
   * Execute the payment to validate the detach
   * @param  {string}  orderId       Detach order identifier
   * @param  {string}  paymentMethod Payment method to use
   * @return {Promise}
   */
  payDetach(orderId, paymentMethod) {
    const paymentParameters = {
      paymentMean: paymentMethod.paymentType,
    };

    if (
      [
        this.OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT,
        this.OVH_PAYMENT_METHOD_TYPE.CREDIT_CARD,
        this.OVH_PAYMENT_METHOD_TYPE.PAYPAL,
      ].includes(paymentMethod.paymentType)
    ) {
      paymentParameters.paymentMeanId = paymentMethod.paymentMeanId;
    }

    return this.orderService.payRegisteredPaymentMean(
      {
        orderId,
      },
      paymentParameters,
    ).$promise;
  }
}
