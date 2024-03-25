import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import last from 'lodash/last';
import range from 'lodash/range';


import {
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  TRACKING_PREFIX,
  VPS_MAX_QUANTITY,
  IP_AGORA,
  ADDITIONAL_IP,
  BLOCK_ADDITIONAL_IP,
  ALERT_ID,
} from '../ip-ip-agoraOrder.constant';

export default class AgoraIpV6OrderController {
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
    atInternet,
    coreConfig,
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
    this.atInternet = atInternet;
    this.IP_AGORA = IP_AGORA;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.BLOCK_ADDITIONAL_IP = BLOCK_ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.region = coreConfig.getRegion();
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.loading = {};
    this.currentStep = 0;
  }


  $onInit() {
    this.model = {
      params: {},
      selectedService: null,
    };
    this.user = this.$state.params.user;
    this.catalogName = this.$state.params.catalogName;
    this.loadOptions();
  }

  loadOptions() {

  }

  manageLoadIpOffers() {
    this.ipOffers = [];
    this.failoverIpOffers = [];
    this.blockIpOffers = [];

    const { serviceName } = this.model.selectedService;

    if (
      this.model?.selectedService?.type ===
      PRODUCT_TYPES.dedicatedServer.typeName
    ) {
      return this.IpAgoraOrder.checkIpDedicatedServerIsOrderable(
        serviceName,
      ).then((isOrderable) => {
        if (!isOrderable) {
          this.Alerter.set(
            'alert-warning',
            this.$translate.instant('ip_order_quota_full'),
            null,
            this.ALERT_ID,
          );
          this.loading.ipOffers = false;
          return this.$q.reject();
        }
        return this.loadIpOffers();
      });
    }
    if (
      this.model?.selectedService?.type === PRODUCT_TYPES.privateCloud.typeName
    ) {
      return this.IpAgoraOrder.getOrderableIpCountries(serviceName).then(
        (orderableIpCountries) => {
          this.orderableIpCountries = orderableIpCountries;
          return this.loadIpOffers();
        },
      );
    }
    return this.loadRegions();
  }

  loadPrivateCloudIpOffers(serviceName) {
    const countries = this.orderableIpCountries.map((code) => {
      return {
        code: code.toUpperCase(),
        description: this.$translate.instant(`country_${code.toUpperCase()}`),
        icon: `oui-flag oui-flag_${code}`,
      };
    });

    return this.IpAgoraOrder.getPrivateCloudIpOffers(serviceName).then(
      (ipOffers) => {
        this.blockIpOffers = ipOffers.map((offer) => {
          const price = head(offer.prices);
          const maximumQuantity = get(price, 'maximumQuantity') || 1;
          return {
            ...offer,
            productShortName: offer.productName,
            countries,
            price: price.price,
            productDisplayName: `${offer.productName} - ${price.price.text}`,
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

  loadServices() {
    this.loading.services = true;

    return this.$q
      .all({
        user: this.User.getUser(),
        services: this.IpAgoraOrder.getServices(),
        ipFailoverPrice: this.IpAgoraOrder.getIpFailoverPrice(
          this.ovhSubsidiary,
          this.region,
        ),
      })
      .then((results) => {
        this.user = results.user;
        this.services = results.services;
        this.ipFailoverPrice = results.ipFailoverPrice;

        if (this.$state.params.service) {
          this.model.selectedService = find(this.services, {
            serviceName: this.$state.params.service.serviceName,
          });
        }
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('ip_order_loading_error', this.ALERT_ID),
        );
        return this.$state.go('^').then(() => this.$q.reject(err));
      })
      .finally(() => {
        this.loading.services = false;
      });
  }

  loadRegions() {
    this.loading.regions = true;
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
        this.catalogName,
      ).then((ipOffers) => {
        const ipOfferDetails = ipOffers.map(this.createOfferDto.bind(this));
        let failoverIpOfferDetails;
        let blockIpOfferDetails;
        console.log(">>>>>>", this.model.selectedService.type, PRODUCT_TYPES.dedicatedServer.typeName)
        if (this.model.selectedService.type === PRODUCT_TYPES.vps.typeName) {
          failoverIpOfferDetails = ipOfferDetails
            .filter(({ planCode }) => planCode.includes('failover'))
            .map((offer) => ({
              ...offer,
              quantities: range(1, VPS_MAX_QUANTITY + 1),
            }));
        } else if (
          this.model.selectedService.type ===
          PRODUCT_TYPES.dedicatedServer.typeName
        ) {
          // blockIpOfferDetails = this.filterOffer(
          //   ipOfferDetails,
          //   'productShortName',
          //   'block',
          // );
          // failoverIpOfferDetails = this.filterOffer(
          //   ipOfferDetails,
          //   'planCode',
          //   'failover',
          // );
        }

        const ipCountryAvailablePromise = this.IpAgoraOrder.getIpCountryAvailablePromise(
          this.model.selectedService.serviceName,
          this.model.selectedService.type,
        );

        return ipCountryAvailablePromise
          .then((data) => {
            let countries = data;
            if (data.length === 0) {
              const REGION = AgoraIpV6OrderController.getRegionFromServiceName(
                this.model.selectedService.serviceName,
              );
              countries = IP_LOCATION_GROUPS.find((group) =>
                group.labels.includes(REGION),
              )?.countries;
            }
            console.log(">>>>>",this.model.params.selectedOffer.countries);
            
            const ipOffersByRegion = AgoraIpV6OrderController.getRegionsOffers(
              countries,
            );
            // this.failoverIpOffers = this.getOfferDetails(
            //   failoverIpOfferDetails,
            //   ipOffersByRegion,
            //   countries,
            // );
            // this.blockIpOffers = this.getOfferDetails(
            //   blockIpOfferDetails,
            //   ipOffersByRegion,
            //   countries,
            // ).sort((a, b) => a.price.value - b.price.value);
          })
          .catch((error) => {
            console.log(">>>>>", error)
            this.ipOffers = AgoraIpV6OrderController.filterOfferDetailsFromServiceName(
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
        console.log(err);
        this.Alerter.error(
          this.$translate.instant('ip_order_loading_error'),
          this.ALERT_ID,
        );
        this.$state.go('^');
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading.ipOffers = false;
      });
  }

  onSelectedOfferChange(selectedOffer) {
    this.maxSize = IP_AGORA[selectedOffer].maxQty;
    this.minSize = IP_AGORA[selectedOffer].minQty;
    this.model.params.selectedQuantity = this.minSize;
    this.model.params.selectedOrganisation = null;
    this.model.params.selectedCountry = null;
    if (get(this.model, 'params.selectedOffer.countries.length') === 1) {
      this.model.params.selectedCountry = head(
        get(this.model, 'params.selectedOffer.countries'),
      );
    }

    console.log(this.model.params.selectedCountry)
  }

  getOfferDetails = (offerDetails, ipOffersByRegion, countryList) => {
    return offerDetails
      .filter(({ productRegion }) => ipOffersByRegion.includes(productRegion))
      .map((ipOffer) => {
        return {
          ...ipOffer,
          productDisplayName: `${ipOffer.productShortName} - ${ipOffer.price.text}`,
          countries: ipOffer.countries.filter(
            ({ code }) => countryList.indexOf(code.toLowerCase()) > -1,
          ),
        };
      });
  };

  createOfferDto(ipOffer) {
    const { default: defaultPricing } = ipOffer.details.pricings;
    const renewCapacity = defaultPricing.find((price) =>
      price.capacities.find((capacity) => capacity === 'renew'),
    );
    const { maximumQuantity } = renewCapacity;

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
        icon: this.$translate.instant(
          `oui-flag oui-flag_${
            countryCode.toLowerCase() === 'uk'
              ? 'gb'
              : countryCode.toLowerCase()
          }`,
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

  static filterOfferDetailsFromServiceName(offerDetails, serviceName) {
    return filter(offerDetails, {
      productRegion: AgoraIpV6OrderController.getRegionFromServiceName(serviceName),
    });
  }


  getServiceTypeLabel(type) {
    return this.$translate.instant(`ip_filter_services_title_${type}`);
  }

  redirectToPaymentPage() {
    console.log('done');
  }
}
