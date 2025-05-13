import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';

export default class LicenseOrder {
  /* @ngInject */
  constructor($q, License, LicenseAgoraOrder, licenseFeatureAvailability) {
    this.$q = $q;
    this.licenseFeatureAvailability = licenseFeatureAvailability;
    this.License = License;
    this.LicenseAgoraOrder = LicenseAgoraOrder;
  }

  getLicenseOffers(licenseType) {
    return this.LicenseAgoraOrder.getLicenseOffers(licenseType);
  }

  getLicenseDurations(licenseInfo) {
    if (!this.licenseFeatureAvailability.allowLicenseAgoraOrder()) {
      return this.License.orderDuration(licenseInfo);
    }
    return this.$q.when(['01']);
  }

  getLicensePrices(licenseInfo, durations) {
    const prices = {};
    if (!this.licenseFeatureAvailability.allowLicenseAgoraOrder()) {
      const queue = [];
      forEach(durations, (duration) => {
        queue.push(
          this.License.getLicenseOrderForDuration(
            assign({ duration }, licenseInfo),
          ).then((details) => {
            prices[duration] = details;
          }),
        );
      });

      return this.$q.all(queue).then(() => prices);
    }
    return this.LicenseAgoraOrder.getLicenseOfferPlan(
      licenseInfo.licenseType,
      licenseInfo.version,
      this.ip,
    ).then((plan) => {
      const activeOptions = [];
      forEach(keys(licenseInfo.options), (key) => {
        if (get(licenseInfo.options[key], 'value')) {
          activeOptions.push(licenseInfo.options[key].value);
        }
      });

      const promises = map(durations, (duration) =>
        plan
          .getPrice({
            duration: Number(duration),
            options: activeOptions,
            licenseType: licenseInfo.licenseType,
          })
          .then((price) => {
            prices[duration] = price;
          }),
      );

      return this.$q.all(promises).then(() => prices);
    });
  }

  getFinalizeOrderUrl(licenseInfo) {
    if (!this.licenseFeatureAvailability.allowLicenseAgoraOrder()) {
      // this shouldn't be used.
      return this.$q.when('');
    }
    return this.LicenseAgoraOrder.getFinalizeOrderUrl(
      assign({}, licenseInfo, { duration: Number(licenseInfo.duration) }),
    );
  }
}
