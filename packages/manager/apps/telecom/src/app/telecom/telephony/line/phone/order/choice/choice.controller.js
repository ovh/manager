import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import head from 'lodash/head';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import set from 'lodash/set';
import upperFirst from 'lodash/upperFirst';

import { TELEPHONY_LINE_PHONE_CHOICE } from './choice.constant';
import initializeBrandList from './choice.service';

export default class TelephonyLinePhoneOrderChoiceCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    atInternet,
    coreConfig,
    OvhApiOrder,
    OvhApiTelephony,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.phoneToOrder = null;
    this.selectedPhone = null;
    this.isReturnPhone = false;

    this.isStepLoading = true;
    if (this.phone) {
      return this.fetchMerchandiseAvailable()
        .then((result) => {
          map(result, (phone) => {
            angular.extend(phone, {
              brand: phone.name,
              url: TELEPHONY_LINE_PHONE_CHOICE[phone.name]
                ? TELEPHONY_LINE_PHONE_CHOICE[phone.name].url
                : null,
              img: TELEPHONY_LINE_PHONE_CHOICE[phone.name]
                ? TELEPHONY_LINE_PHONE_CHOICE[phone.name].img
                : null,
            });
          });
          this.merchandise = result;
        })
        .catch((err) => new this.TucToastError(err))
        .finally(() => {
          this.phoneOffers = this.merchandise;
          this.brandList = initializeBrandList(this.merchandise);
          this.isStepLoading = false;
        });
    }
    return this.fetchOfferPhones(this.line.getPublicOffer.name)
      .then((offers) => {
        this.phoneOffers = offers;
        this.brandList = initializeBrandList(offers);
        this.phonesDisplayed = this.updatePhones();
      })
      .finally(() => {
        this.isStepLoading = false;
      });
  }

  fetchOfferPhones(offer) {
    return this.OvhApiTelephony.v6().getLineOfferPhones({
      country: this.line.getCountry(),
      offer,
    }).$promise;
  }

  fetchMerchandiseAvailable() {
    return this.OvhApiTelephony.Line()
      .Phone()
      .v6()
      .getMerchandiseAvailable({
        billingAccount: this.billingAccount,
        serviceName: this.serviceName,
      })
      .$promise.then((result) => {
        forEach(result, (phone) => {
          const parts = (phone.name || '').split(/\./);
          set(
            phone,
            'displayName',
            `${upperFirst(head(parts))} ${parts
              .slice(1)
              .map((p) => (p || '').toUpperCase())
              .join(' ')}`,
          );
        });
        return filter(result, (phone) => phone.price && phone.price.value >= 0);
      })
      .then((result) =>
        this.fetchOfferPhones(this.line.getPublicOffer.name).then((offers) => {
          forEach(offers, (offer) => {
            const found = find(result, { name: offer.brand });
            if (found) {
              found.displayName = offer.description;
            }
          });
          return result;
        }),
      );
  }

  filterByBrand(brand) {
    if ('all'.includes(brand.toLowerCase())) {
      this.phonesDisplayed = this.phoneOffers;
    } else {
      this.phonesDisplayed = this.phoneOffers.filter((offer) =>
        offer.brand.includes(brand.toLowerCase()),
      );
    }
  }

  sortPrice(order) {
    this.phonesDisplayed = orderBy(this.phoneOffers, 'price.value', order);
  }

  updatePhones() {
    const phones = this.phoneOffers;
    return this.$q.all(
      map(phones, (phone) => {
        if (phone.fees) {
          angular.extend(phone.fees, {
            priceText:
              phone.fees.currencyCode === 'EUR'
                ? `${phone.fees.value} €`
                : `${phone.fees.value} ${phone.fees.currencyCode}`,
          });
        }
        angular.extend(phone, {
          url: TELEPHONY_LINE_PHONE_CHOICE[phone.brand]
            ? TELEPHONY_LINE_PHONE_CHOICE[phone.brand].url
            : null,
          img: TELEPHONY_LINE_PHONE_CHOICE[phone.brand]
            ? TELEPHONY_LINE_PHONE_CHOICE[phone.brand].img
            : null,
        });
      }),
    );
  }

  selectPhone() {
    this.selectedPhone = this.phoneToOrder;
    if (this.isReturnPhone) {
      this.isReturnPhone = false;
    }
  }

  nextStep() {
    this.atInternet.trackPage({
      name: 'telecom::telephony::billingAccount::line::phone::order::delivery',
    });
    if (!this.isReturnPhone) {
      this.$scope.$emit('phoneSelected', this.selectedPhone);
    } else {
      this.$scope.$emit('returnPhone', this.phone);
    }
    if (this.phone) {
      this.track(
        `telecom::telephony::billingAccount::line::phone::change::${this.selectedPhone}_validate`,
      );
    } else {
      this.track(
        `telecom::telephony::billingAccount::line::phone::order::${this.selectedPhone}_validate`,
      );
    }
  }

  returnPhone() {
    this.isReturnPhone = true;
  }

  isSamePhone() {
    return (
      this.phone &&
      this.selectedPhone &&
      `phone.${this.selectedPhone}` === this.phone.brand
    );
  }

  track(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
