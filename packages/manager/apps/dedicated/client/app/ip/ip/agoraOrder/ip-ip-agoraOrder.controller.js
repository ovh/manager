import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import map from 'lodash/map';
import range from 'lodash/range';
import uniq from 'lodash/uniq';

angular.module('Module.ip.controllers').controller(
  'agoraIpOrderCtrl',
  class AgoraIpOrderCtrl {
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

    static getRegionFromServiceName(serviceName) {
      const serviceExt = last(serviceName.split('.'));
      if (serviceExt === 'eu') {
        return 'EUROPE';
      }
      if (serviceExt === 'net') {
        return 'APAC/CANADA';
      }

      return 'USA';
    }

    loadIpOffers() {
      this.loading.ipOffers = true;

      this.model.params = {};

      const ipOffersPromise = this.IpAgoraOrder.getIpOffers().then(
        (ipOffers) => {
          const ipOfferDetails = ipOffers.map(this.createOfferDto.bind(this));
          this.ipOffers = filter(ipOfferDetails, {
            productRegion: AgoraIpOrderCtrl.getRegionFromServiceName(
              this.model.selectedService.serviceName,
            ),
          });
        },
      );

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
        !this.model.params.selectedCountry
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
      const productToOrder = this.IpAgoraOrder.constructor.createProductToOrder(
        {
          country: get(this.model.params, 'selectedCountry.code'),
          destination: this.model.selectedService.serviceName,
          organisation: get(
            this.model.params,
            'selectedOrganisation.organisationId',
          ),
          planCode: get(this.model.params, 'selectedOffer.planCode'),
          quantity: get(this.model.params, 'selectedQuantity', 1),
        },
      );

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
