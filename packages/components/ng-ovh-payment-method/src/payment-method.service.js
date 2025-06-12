import { useReket, ssoAuthHookFn } from '@ovh-ux/ovh-reket';
import { useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';

export default class OvhPaymentMethodService {
  /* @ngInject */
  constructor($q, coreConfig, paymentMethodPageUrl, userLocale) {
    const ovhPaymentMethodReketInstance = useReket(false);
    const responseSuccessHook = (response) => $q.when(response);

    const responseErrorHook = (error) => {
      return ssoAuthHookFn(error).catch((hookFnError) =>
        $q.reject(hookFnError),
      );
    };

    ovhPaymentMethodReketInstance.config.hooks.response.set(
      responseSuccessHook,
      responseErrorHook,
    );

    this.ovhPaymentMethod = useOvhPaymentMethod({
      reketInstance: ovhPaymentMethodReketInstance,
      region: coreConfig.getRegion(),
    });

    this.$q = $q;
    this.paymentMethodPageUrl = paymentMethodPageUrl;
    this.userLocale = userLocale;
  }

  getUserLocale() {
    return this.userLocale;
  }

  hasDefaultPaymentMethod() {
    const { hasDefaultPaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(hasDefaultPaymentMethod());
  }

  getDefaultPaymentMethod() {
    const { getDefaultPaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(getDefaultPaymentMethod());
  }

  getAvailablePaymentMethodTypes() {
    const { getAvailablePaymentMethods } = this.ovhPaymentMethod;

    return this.$q.when(getAvailablePaymentMethods());
  }

  getAllAvailablePaymentMethodTypes(options) {
    const { getAllAvailablePaymentMethods } = this.ovhPaymentMethod;

    return this.$q.when(getAllAvailablePaymentMethods(options));
  }

  addPaymentMethod(paymentMethodType, params = {}) {
    const { addPaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(addPaymentMethod(paymentMethodType, params));
  }

  editPaymentMethod(paymentMethod, params) {
    const { editPaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(editPaymentMethod(paymentMethod, params));
  }

  setPaymentMethodAsDefault(paymentMethod) {
    const { setDefaultPaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(setDefaultPaymentMethod(paymentMethod));
  }

  challengePaymentMethod(paymentMethod, challenge) {
    const { challengePaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(challengePaymentMethod(paymentMethod, challenge));
  }

  addPaymentDetails(paymentMethodId, details) {
    const { addPaymentMethodDetails } = this.ovhPaymentMethod;

    return this.$q.when(addPaymentMethodDetails(paymentMethodId, details));
  }

  finalizePaymentMethod(paymentValidation, finalizeData = {}) {
    const { finalizePaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(finalizePaymentMethod(paymentValidation, finalizeData));
  }

  deletePaymentMethod(paymentMethod) {
    const { deletePaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(deletePaymentMethod(paymentMethod));
  }

  getPaymentMethod(paymentMethodId) {
    const { getPaymentMethod } = this.ovhPaymentMethod;

    return this.$q.when(getPaymentMethod(paymentMethodId));
  }

  getPaymentMethods(options) {
    const { getPaymentMethods } = this.ovhPaymentMethod;

    return this.$q.when(getPaymentMethods(options));
  }

  getAllPaymentMethods(options) {
    const { getAllPaymentMethods } = this.ovhPaymentMethod;

    return this.$q.when(getAllPaymentMethods(options));
  }
}
