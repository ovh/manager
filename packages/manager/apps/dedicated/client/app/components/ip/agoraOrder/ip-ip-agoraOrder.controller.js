import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import last from 'lodash/last';
import map from 'lodash/map';
import range from 'lodash/range';
import uniq from 'lodash/uniq';

import {
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  TRACKING_PREFIX,
  VPS_MAX_QUANTITY,
  IP_AGORA,
  ADDITIONAL_IP,
  BLOCK_ADDITIONAL_IP,
  ALERT_ID,
} from './ip-ip-agoraOrder.constant';

export default class AgoraIpOrderCtrl {
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
    ovhManagerRegionService,
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
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.model = {
      params: {},
      selectedService: null,
      selectedServiceRegion: null,
    };
    this.loading = {};
    this.user = this.$state.params.user;
    this.catalogName = this.$state.params.catalogName;
    this.loadServices();
  }

  loadServices() {
    this.atInternet.trackClick({
      name: `dedicated::ip::dashboard::order`,
      type: 'action',
    });
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

  getServiceTypeLabel(type) {
    return this.$translate.instant(`ip_filter_services_title_${type}`);
  }

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

  trackFinalStep() {
    this.trackStep(3);
  }

  getServiceRegion() {
    this.model.selectedServiceRegion = null;
    let request = null;
    const { serviceName } = this.model.selectedService;

    switch (this.model.selectedService?.type) {
      case PRODUCT_TYPES.dedicatedServer.typeName:
        request = this.IpAgoraOrder.getDedicatedServerRegion(serviceName);
        break;
      case PRODUCT_TYPES.vps.typeName:
        request = this.IpAgoraOrder.getVpsServerRegion(serviceName);
        break;
      case PRODUCT_TYPES.privateCloud.typeName:
        request = this.IpAgoraOrder.getDedicatedCloudServerRegion(serviceName);
        break;
      default:
        request = this.$q.when(null);
        break;
    }

    request.then((region) => {
      this.model.selectedServiceRegion =
        this.model.selectedService?.type ===
        PRODUCT_TYPES.dedicatedServer.typeName
          ? this.$translate.instant(`ip_region_${region}`)
          : this.ovhManagerRegionService.getTranslatedMicroRegionLocation(
              region,
            );
    });
  }

  manageLoadIpOffers() {
    this.trackStep(2);
    this.loading.ipOffers = true;
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
    return this.loadIpOffers();
  }

  getOfferContent(offer) {
    return `${offer.productShortName} - ${
      offer.price.text
    }/${this.$translate.instant('ip_month')}`;
  }

  loadIpOffers() {
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
          blockIpOfferDetails = this.filterOffer(
            ipOfferDetails,
            'productShortName',
            'block',
          );
          failoverIpOfferDetails = this.filterOffer(
            ipOfferDetails,
            'planCode',
            'failover',
          );
        }

        const ipCountryAvailablePromise = this.IpAgoraOrder.getIpCountryAvailablePromise(
          this.model.selectedService.serviceName,
          this.model.selectedService.type,
        );

        return ipCountryAvailablePromise
          .then((data) => {
            let countries = data;
            if (data.length === 0) {
              const REGION = AgoraIpOrderCtrl.getRegionFromServiceName(
                this.model.selectedService.serviceName,
              );
              countries = IP_LOCATION_GROUPS.find((group) =>
                group.labels.includes(REGION),
              )?.countries;
            }
            const ipOffersByRegion = AgoraIpOrderCtrl.getRegionsOffers(
              countries,
            );
            this.failoverIpOffers = this.getOfferDetails(
              failoverIpOfferDetails,
              ipOffersByRegion,
              countries,
            );
            this.blockIpOffers = this.getOfferDetails(
              blockIpOfferDetails,
              ipOffersByRegion,
              countries,
            ).sort((a, b) => a.price.value - b.price.value);
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

  static filterOfferDetailsFromServiceName(offerDetails, serviceName) {
    return filter(offerDetails, {
      productRegion: AgoraIpOrderCtrl.getRegionFromServiceName(serviceName),
    });
  }

  getIpOfferRegions() {
    return uniq(map(this.ipOffers, 'productRegion')).sort();
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

  redirectToPaymentPage() {
    const { params, selectedService } = this.model;
    const serviceType = selectedService.type;
    const offerPlanCode = params.selectedOffer.planCode;
    const quantity = params.selectedQuantity || 1;
    const countryCode = params.selectedCountry?.code || null;
    const orderableIpCountry =
      countryCode || get(this.orderableIpCountries, '[0]', '');
    const commonProductProps = {
      destination: get(this.model, 'selectedService.serviceName'),
      country: orderableIpCountry,
      planCode: get(this.model.params, 'selectedOffer.planCode'),
      quantity: get(this.model.params, 'selectedQuantity', 1),
    };

    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}confirm_${serviceType}_${offerPlanCode}_${quantity}${
        countryCode ? `_${countryCode}` : ''
      }`,
      type: 'action',
    });

    let productToOrder = null;
    if (this.isPrivateCloudOffer) {
      productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
        productId: 'privateCloud',
        duration: get(this.model.params, 'selectedOffer.duration'),
        pricingMode: get(this.model.params, 'selectedOffer.pricingMode'),
        serviceName: get(this.model, 'selectedService.serviceName'),
        ...commonProductProps,
      });
    } else {
      productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
        organisation: get(
          this.model.params,
          'selectedOrganisation.organisationId',
        ),
        ...commonProductProps,
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
        this.Alerter.error(
          this.$translate.instant('ip_order_finish_error'),
          this.ALERT_ID,
        );
        return this.$state.go('^').then(() => this.$q.reject(err));
      })
      .finally(() => this.$state.go('^'));
  }

  resumeOrder() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}cancel`,
      type: 'action',
    });
    return this.$state.go('^');
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

  filterOffer(ipOfferDetails, key, searchTerm) {
    this.VPS_MAX_QUANTITY = VPS_MAX_QUANTITY;
    return ipOfferDetails
      .filter((data) => data[key].includes(searchTerm))
      .map((offer) => ({
        ...offer,
        quantities: range(1, VPS_MAX_QUANTITY + 1),
      }));
  }

  isFailoverShowable() {
    return (
      this.model.selectedService?.type === PRODUCT_TYPES.vps.typeName ||
      this.model.selectedService?.type ===
        PRODUCT_TYPES.dedicatedServer.typeName
    );
  }

  canShowBlockSelection() {
    return (
      this.model.selectedService?.type ===
        PRODUCT_TYPES.privateCloud.typeName ||
      this.model.selectedService?.type ===
        PRODUCT_TYPES.dedicatedServer.typeName
    );
  }

  static stringLocaleSensitiveComparator(v1, v2) {
    return v1.value.localeCompare(v2.value);
  }

  trackPrevious() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}previous`,
      type: 'action',
    });
  }

  trackStep(count) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}next-step-${count}`,
      type: 'action',
    });
  }
}
