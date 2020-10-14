import filter from 'lodash/filter';
import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import last from 'lodash/last';
import map from 'lodash/map';
import range from 'lodash/range';
import set from 'lodash/set';
import uniq from 'lodash/uniq';

import {
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  VPS_MAX_QUANTITY,
} from './ip-ip-agoraOrder.constant';

angular.module('Module.ip.controllers').controller(
  'agoraIpOrderCtrl',
  class AgoraIpOrderCtrl {
    /* @ngInject */
    constructor(
      $q,
      $rootScope,
      $scope,
      $state,
      $translate,
      $window,
      Alerter,
      IpAgoraOrder,
      IpOrganisation,
      User,
    ) {
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$state = $state;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.IpAgoraOrder = IpAgoraOrder;
      this.IpOrganisation = IpOrganisation;
      this.User = User;
    }

    $onInit() {
      this.model = {
        params: {},
        selectedService: null,
      };

      this.loading = {};
      this.user = this.$state.params.user;

      // need to be scoped because of how wizard-step works
      this.$scope.loadServices = this.loadServices.bind(this);
      this.$scope.loadIpOffers = this.loadIpOffers.bind(this);
      this.$scope.redirectToPaymentPage = this.redirectToPaymentPage.bind(this);
      this.$scope.resumeOrder = this.resumeOrder.bind(this);
      this.$scope.stringLocaleSensitiveComparator =
        AgoraIpOrderCtrl.stringLocaleSensitiveComparator;
    }

    loadServices() {
      this.loading.services = true;

      return this.$q
        .all({
          user: this.User.getUser(),
          services: this.IpAgoraOrder.getServices(),
        })
        .then((results) => {
          this.user = results.user;
          this.services = results.services;

          if (this.$state.params.service) {
            this.model.selectedService = find(this.services, {
              serviceName: this.$state.params.service.serviceName,
            });
          }
        })
        .catch((err) => {
          this.Alerter.error(this.$translate.instant('ip_order_loading_error'));

          return this.$state.go('^').then(() => this.$q.reject(err));
        })
        .finally(() => {
          this.loading.services = false;
        });
    }

    getServiceTypeLabel(type) {
      return this.$translate.instant(`ip_filter_services_title_${type}`);
    }

    createOfferDto(ipOffer) {
      const maximumQuantity = get(
        ipOffer.details.pricings.default.find(
          (price) => head(price.capacities) === 'renew',
        ),
        'maximumQuantity',
      );

      const countryCodes = ipOffer.details.product.configurations.find(
        (config) => config.name === 'country',
      ).values;

      return {
        productName: ipOffer.invoiceName,
        productShortName: ipOffer.invoiceName.replace(/^.*\]\s*/, ''),
        productRegion: get(ipOffer.invoiceName.match(/^\[([^\]]+)\]/), '1'),
        planCode: ipOffer.planCode,
        price: ipOffer.details.pricings.default.find(
          (price) => price.capacities[0] === 'installation',
        ).price,
        maximumQuantity,
        quantities: range(1, maximumQuantity + 1),
        countries: countryCodes.map((countryCode) => ({
          code: countryCode,
          description: this.$translate.instant(
            `country_${countryCode.toUpperCase()}`,
          ),
        })),

        // Only ip block offer has a maximum quantity of 1.
        // This is a way to distinguish an ip block offer from a single ip address offer.
        isIpBlockOffer: maximumQuantity === 1,
      };
    }

    static getRegionsOffers(countries) {
      return flattenDeep(
        IP_LOCATION_GROUPS.filter(
          (group) => intersection(group.countries, countries).length > 0,
        ).map(({ labels }) => labels),
      );
    }

    static getRegionFromServiceName(serviceName) {
      const serviceExt = last(serviceName.split('.'));
      if (['eu', 'net'].includes(serviceExt)) {
        return 'EUROPE';
      }
      if (serviceExt === 'ca') {
        return 'CANADA - ASIA';
      }

      return 'USA';
    }

    loadPrivateCloudIpOffers(serviceName) {
      return this.IpAgoraOrder.getPrivateCloudIpOffers(serviceName).then(
        (ipOffers) => {
          this.ipOffers = map(ipOffers, (offer) => {
            const price = head(offer.prices);
            const maximumQuantity = get(price, 'maximumQuantity') || 1;
            return {
              ...offer,
              productShortName: offer.productName,
              price: price.price,
              duration: 'P1M', // @todo use price.duration when api is fixed
              pricingMode: price.pricingMode,
              maximumQuantity,
              quantities: range(1, maximumQuantity + 1),
              isIpBlockOffer: maximumQuantity === 1,
            };
          });
        },
      );
    }

    loadIpOffers() {
      this.loading.ipOffers = true;

      this.model.params = {};
      let ipOffersPromise;

      this.isPrivateCloudOffer =
        get(this.model, 'selectedService.type') ===
        PRODUCT_TYPES.privateCloud.typeName;

      if (this.isPrivateCloudOffer) {
        ipOffersPromise = this.loadPrivateCloudIpOffers(
          get(this.model, 'selectedService.serviceName'),
        );
      } else {
        ipOffersPromise = this.IpAgoraOrder.getIpOffers(
          this.user.ovhSubsidiary,
        ).then((ipOffers) => {
          let ipOfferDetails = ipOffers.map(this.createOfferDto.bind(this));
          if (this.model.selectedService.type === PRODUCT_TYPES.vps.typeName) {
            ipOfferDetails = ipOfferDetails
              .filter(({ productShortName }) =>
                productShortName.includes('failover'),
              )
              .map((offer) => ({
                ...offer,
                quantities: range(1, VPS_MAX_QUANTITY + 1),
              }));
          }

          const ipCountryAvailablePromise = this.IpAgoraOrder.getIpCountryAvailablePromise(
            this.model.selectedService.serviceName,
            this.model.selectedService.type,
          );

          return ipCountryAvailablePromise
            .then((countries) => {
              if (countries && countries.length > 0) {
                const ipOffersByRegion = AgoraIpOrderCtrl.getRegionsOffers(
                  countries,
                );
                this.ipOffers = ipOfferDetails
                  .filter(({ productRegion }) =>
                    ipOffersByRegion.includes(productRegion),
                  )
                  .map((ipOffer) => {
                    set(
                      ipOffer,
                      'countries',
                      ipOffer.countries.filter(
                        ({ code }) =>
                          countries.indexOf(code.toLowerCase()) > -1,
                      ),
                    );
                    return ipOffer;
                  });
              } else {
                this.ipOffers = AgoraIpOrderCtrl.filterOfferDetailsFromServiceName(
                  ipOfferDetails,
                  this.model.selectedService.serviceName,
                );
              }
            })
            .catch(() => {
              this.ipOffers = AgoraIpOrderCtrl.filterOfferDetailsFromServiceName(
                ipOfferDetails,
                this.model.selectedService.serviceName,
              );
            });
        });
      }

      const ipOrganisationPromise = this.IpOrganisation.getIpOrganisation().then(
        (organisations) => {
          this.organisations = organisations;
        },
      );

      return this.$q
        .all([ipOffersPromise, ipOrganisationPromise])
        .catch((err) => {
          this.Alerter.error(this.$translate.instant('ip_order_loading_error'));
          this.$state.go('^');
          return this.$q.reject(err);
        })
        .finally(() => {
          this.loading.ipOffers = false;
        });
    }

    static filterOfferDetailsFromServiceName(offerDetails, serviceName) {
      return filter(offerDetails, {
        productRegion: AgoraIpOrderCtrl.getRegionFromServiceName(serviceName),
      });
    }

    getIpOfferRegions() {
      return uniq(map(this.ipOffers, 'productRegion')).sort();
    }

    onSelectedOfferChange() {
      this.model.params.selectedQuantity = undefined;
      this.model.params.selectedOrganisation = null;
      this.model.params.selectedCountry = null;

      if (get(this.model, 'params.selectedOffer.countries.length') === 1) {
        this.model.params.selectedCountry = head(
          get(this.model, 'params.selectedOffer.countries'),
        );
      }
    }

    isOfferFormValid() {
      if (
        !this.model.params.selectedOffer ||
        (!this.model.params.selectedCountry && !this.isPrivateCloudOffer)
      ) {
        return false;
      }

      if (
        !this.model.params.selectedOffer.isIpBlockOffer &&
        !this.model.params.selectedQuantity
      ) {
        return false;
      }

      return true;
    }

    redirectToOrganisationPage() {
      this.$rootScope.$broadcast('ips.display', 'organisation');
      this.$state.go('^');
    }

    redirectToPaymentPage() {
      let productToOrder = null;
      if (this.isPrivateCloudOffer) {
        productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
          productId: 'privateCloud',
          duration: get(this.model.params, 'selectedOffer.duration'),
          pricingMode: get(this.model.params, 'selectedOffer.pricingMode'),
          country: get(this.model.params, 'selectedCountry.code'),
          destination: get(this.model, 'selectedService.serviceName'),
          serviceName: get(this.model, 'selectedService.serviceName'),
          planCode: get(this.model.params, 'selectedOffer.planCode'),
          quantity: get(this.model.params, 'selectedQuantity', 1),
        });
      } else {
        productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
          country: get(this.model.params, 'selectedCountry.code'),
          destination: this.model.selectedService.serviceName,
          organisation: get(
            this.model.params,
            'selectedOrganisation.organisationId',
          ),
          planCode: get(this.model.params, 'selectedOffer.planCode'),
          quantity: get(this.model.params, 'selectedQuantity', 1),
        });
      }

      return this.User.getUrlOf('express_order')
        .then((url) => {
          this.$window.open(
            `${url}review?products=${JSURL.stringify([productToOrder])}`,
            '_blank',
          );
        })
        .catch((err) => {
          this.Alerter.error(this.$translate.instant('ip_order_finish_error'));
          return this.$state.go('^').then(() => this.$q.reject(err));
        })
        .finally(() => this.$state.go('^'));
    }

    resumeOrder() {
      return this.$state.go('^');
    }

    static stringLocaleSensitiveComparator(v1, v2) {
      return v1.value.localeCompare(v2.value);
    }
  },
);
