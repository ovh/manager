import { useReket, ssoAuthHookFn } from '@ovh-ux/ovh-reket';
import { useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';

export default class OvhPaymentMethodService {
  /* @ngInject */
  constructor($q, coreConfig, paymentMethodPageUrl, userLocale) {
    const ovhPaymentMethodReketInstance = useReket();
    const responseErrorHook = (error) => {
      return ssoAuthHookFn(error).catch((hookFnError) =>
        $q.reject(hookFnError),
      );
    };

    ovhPaymentMethodReketInstance.config.hooks.response.set(
      null,
      responseErrorHook,
    );

    this.ovhPaymentMethod = useOvhPaymentMethod({
      reketInstance: ovhPaymentMethodReketInstance,
      region: coreConfig.getRegion(),
    });

    this.paymentMethodPageUrl = paymentMethodPageUrl;
    this.userLocale = userLocale;
  }

  getUserLocale() {
    return this.userLocale;
  }

  hasDefaultPaymentMethod() {
    const { hasDefaultPaymentMethod } = this.ovhPaymentMethod;

    return hasDefaultPaymentMethod();
  }

  getDefaultPaymentMethod() {
    const { getDefaultPaymentMethod } = this.ovhPaymentMethod;

    return getDefaultPaymentMethod();
  }

  getAvailablePaymentMethodTypes() {
    const { getAvailablePaymentMethods } = this.ovhPaymentMethod;

    return getAvailablePaymentMethods();
  }

  getAllAvailablePaymentMethodTypes(options) {
    const { getAllAvailablePaymentMethods } = this.ovhPaymentMethod;

    return getAllAvailablePaymentMethods(options);
  }

  addPaymentMethod(paymentMethodType, params = {}) {
    const { addPaymentMethod } = this.ovhPaymentMethod;

    return addPaymentMethod(paymentMethodType, params);
  }

  editPaymentMethod(paymentMethod, params) {
    const { editPaymentMethod } = this.ovhPaymentMethod;

    return editPaymentMethod(paymentMethod, params);
  }

  setPaymentMethodAsDefault(paymentMethod) {
    const { setDefaultPaymentMethod } = this.ovhPaymentMethod;

    return setDefaultPaymentMethod(paymentMethod);
  }

  challengePaymentMethod(paymentMethod, challenge) {
    const { challengePaymentMethod } = this.ovhPaymentMethod;

    return challengePaymentMethod(paymentMethod, challenge);
  }

  addPaymentDetails(paymentMethodId, details) {
    const { addPaymentMethodDetails } = this.ovhPaymentMethod;

    return addPaymentMethodDetails(paymentMethodId, details);
  }

  finalizePaymentMethod(paymentValidation, finalizeData = {}) {
    const { finalizePaymentMethod } = this.ovhPaymentMethod;

    return finalizePaymentMethod(paymentValidation, finalizeData);
  }

  deletePaymentMethod(paymentMethod) {
    const { deletePaymentMethod } = this.ovhPaymentMethod;

    return deletePaymentMethod(paymentMethod);
  }

  getPaymentMethod(paymentMethodId) {
    const { getPaymentMethod } = this.ovhPaymentMethod;

    return getPaymentMethod(paymentMethodId);
  }

  getPaymentMethods(options) {
    const { getPaymentMethods } = this.ovhPaymentMethod;

    return getPaymentMethods(options);
  }

  getAllPaymentMethods(options) {
    const { getAllPaymentMethods } = this.ovhPaymentMethod;

    return getAllPaymentMethods(options);
  }
}
