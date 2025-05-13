import get from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import 'moment';

export default class {
  /* @ngInject */
  constructor(
    $q,
    coreConfig,
    ovhPaymentMethod,
    ovhUserPref,
    WUC_SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW,
  ) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhUserPref = ovhUserPref;

    this.WUC_SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW = WUC_SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW;
  }

  $onInit() {
    if (isEmpty(this.productType)) {
      throw new Error('Autorenew invite: Product type is not valid');
    }

    this.loading = true;
    this.preferenceKey = `${this.productType.toUpperCase()}_AUTORENEW_STOP_BOTHER`;

    return this.isAutorenewAllowed()
      .then(() =>
        this.isAutorenewAllowed ? this.getDisplayConditions() : this.$q.when(),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  getDisplayConditions() {
    return this.getProductAutorenewPreferences().then(() =>
      this.hasPaymentMean(),
    );
  }

  hasPaymentMean() {
    return this.ovhPaymentMethod.getPaymentMethods().then((paymentMethods) => {
      this.hasPaymentMean = isArray(paymentMethods) && !isEmpty(paymentMethods);
      return this.hasPaymentMean;
    });
  }

  isAutorenewAllowed() {
    return this.$q
      .when(this.coreConfig.getUser())
      .then(({ ovhSubsidiary }) => {
        this.isAutorenewAllowed = includes(
          this.WUC_SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW,
          ovhSubsidiary,
        );
      })
      .catch(() => {
        this.isAutorenewAllowed = false;
      });
  }

  getProductAutorenewPreferences() {
    return this.ovhUserPref
      .getValue(this.preferenceKey)
      .then((productAutorenewPreferences) => {
        this.productAutorenewPreferences = productAutorenewPreferences;
      })
      .catch(() => {
        this.productAutorenewPreferences = [];
      });
  }

  shouldAskAboutAutorenewSubscription() {
    return !includes(
      this.productAutorenewPreferences,
      this.serviceInfos.domain,
    );
  }

  isInAutorenew() {
    return (
      get(this.serviceInfos, 'renew.automatic') ||
      get(this.serviceInfos, 'renew.forced')
    );
  }

  isExpired() {
    return (
      moment().isAfter(moment(this.serviceInfos.expiration)) ||
      this.serviceInfos.status === 'expired'
    );
  }

  stopBotheringWithAutorenew() {
    return this.ovhUserPref.assign(
      this.preferenceKey,
      this.productAutorenewPreferences.concat(this.serviceInfos.domain),
    );
  }
}
