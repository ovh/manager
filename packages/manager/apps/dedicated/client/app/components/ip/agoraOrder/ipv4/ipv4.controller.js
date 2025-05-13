import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import last from 'lodash/last';
import first from 'lodash/first';
import map from 'lodash/map';
import range from 'lodash/range';
import uniq from 'lodash/uniq';

import {
  DASHBOARD_STATE_NAME,
  IP_TYPE_TITLE,
  TRACKING_PREFIX,
  FUNNEL_TRACKING_PREFIX,
} from '../ip-ip-agoraOrder.constant';

import {
  IP_LOCATION_GROUPS,
  IP_SERVICETYPE__PARK,
  PRODUCT_TYPES,
  VPS_MAX_QUANTITY,
  IP_AGORA,
  ADDITIONAL_IP,
  BLOCK_ADDITIONAL_IP,
  IP_FAILOVER_PLANCODE,
  ALERT_ID,
  DATACENTER_TO_COUNTRY,
  DATACENTER_TO_REGION,
  IP_LOCATION_GROUPS_BASED_ON_DATACENTER,
  REGION_TO_DATACENTER,
  SERVER_REGION,
  ORGANISATION_GROUP,
} from './ipv4.constant';

export default class AgoraIpV4OrderController {
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
    Ipv4AgoraOrder,
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
    this.Ipv4AgoraOrder = Ipv4AgoraOrder;
    this.IpOrganisation = IpOrganisation;
    this.User = User;
    this.atInternet = atInternet;
    this.IP_AGORA = IP_AGORA;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.BLOCK_ADDITIONAL_IP = BLOCK_ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.region = coreConfig.getRegion();
    this.type = IP_TYPE_TITLE.IPv4;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.catalogByLocation = [];
    this.isParkingIpOrVrack = false;
    this.IpOffers = [];
    this.model = {
      params: {},
      selectedService: null,
      selectedServiceRegion: null,
      region: null,
      selectedOffer: null,
      selectedCountry: null,
    };
    this.loading = {};
    this.user = this.$state.params.user;
    this.catalogName = this.$state.params.catalogName;
    this.loadServices();
  }

  getIpv4Catalog() {
    return this.ipCatalog.filter(
      (plan) => plan.planCode.match(/^ip-v4.*|ip-failover.*/) != null,
    );
  }

  onEditStep(step) {
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}tile::add_additional_ip::edit_step_select_${step}`,
      type: 'action',
      level2: 57,
    });
  }

  static isIpv6Plan(planCode) {
    return planCode.match(/^ip-v6.*/) != null;
  }

  getIpFailoverPrice() {
    const ipFailoverRIPEPlan = this.getIpv4Catalog().find(
      ({ planCode }) => planCode === IP_FAILOVER_PLANCODE[this.region],
    );
    if (!ipFailoverRIPEPlan) {
      return null;
    }
    return ipFailoverRIPEPlan.details.pricings.default.find((price) =>
      ['renew', 'installation'].every((capacity) =>
        price.capacities.includes(capacity),
      ),
    );
  }

  loadServices() {
    this.loading.services = true;

    return this.$q
      .all({
        user: this.User.getUser(),
        services: this.Ipv4AgoraOrder.getServices(),
        vrack: this.Ipv4AgoraOrder.getVracks(), // toDo
      })
      .then((results) => {
        results.services.push({
          displayName: IP_SERVICETYPE__PARK,
          serviceName: 'parking',
          type: 'parking',
        });
        this.user = results.user;
        this.services = [...results.services, ...results.vrack];
        this.services = this.services.map((service) => ({
          ...service,
          translatedType:
            service.type === 'parking'
              ? IP_SERVICETYPE__PARK
              : this.$translate.instant(
                  `ip_filter_services_title_${service.type}`,
                ),
        }));
        this.ipFailoverPrice = this.getIpFailoverPrice();

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

  static getServiceTypeLabel(item) {
    return item.translatedType;
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

    const datacenterCodes = ipOffer.details.product.configurations.find(
      (config) => config.name === 'datacenter',
    )?.values;

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
      datacenterCodes,
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

  getServiceRegion() {
    this.trackClick(
      `select_service::next_${this.model.selectedService.serviceName}`,
    );
    this.loadServiceRegion = true;
    this.model.selectedServiceRegion = null;
    let request = null;
    const { serviceName } = this.model.selectedService;

    switch (this.model.selectedService?.type) {
      case PRODUCT_TYPES.dedicatedServer.typeName:
        request = this.Ipv4AgoraOrder.getDedicatedServerRegion(serviceName);
        break;
      case PRODUCT_TYPES.vps.typeName:
        request = this.Ipv4AgoraOrder.getVpsServerRegion(serviceName);
        break;
      case PRODUCT_TYPES.privateCloud.typeName:
        request = this.Ipv4AgoraOrder.getDedicatedCloudServerRegion(
          serviceName,
        );
        break;
      default:
        request = this.$q.when(null);
        break;
    }

    request.then((region) => {
      if (region) {
        this.model.region = region;
        this.model.selectedServiceRegion =
          this.model.selectedService?.type ===
          PRODUCT_TYPES.dedicatedServer.typeName
            ? this.$translate.instant(`ip_region_${region}`)
            : this.ovhManagerRegionService.getTranslatedMicroRegionLocation(
                region.toUpperCase(),
              );
      }
      this.loadServiceRegion = false;
    });
  }

  trackOrganisationLink() {
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}link::add_additional_ip::link_to_organisations_management`,
      type: 'action',
      level2: 57,
    });
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
      return SERVER_REGION.EUROPE;
    }
    if (serviceExt === 'ca') {
      return SERVER_REGION.CANADA;
    }

    return SERVER_REGION.USA;
  }

  static getRegionFromDatacenter(datacenter) {
    return IP_LOCATION_GROUPS_BASED_ON_DATACENTER.find((group) =>
      group.datacenter.includes(datacenter),
    )?.labels;
  }

  static getCountriesFromDatacenter(selectedServiceDatacenter, ipOffers) {
    const ipOffer = ipOffers.find((offer) => {
      return offer.details.product.configurations
        .find((config) => config.name === 'datacenter')
        ?.values?.includes(selectedServiceDatacenter);
    });
    return ipOffer.details.product.configurations.find(
      (config) => config.name === 'country',
    )?.values;
  }

  static getRegionFromServiceRegion(region) {
    const serviceExt = first(region.split('-'));
    if (serviceExt === 'eu') {
      return SERVER_REGION.EUROPE;
    }
    if (serviceExt === 'ca') {
      return SERVER_REGION.CANADA;
    }

    return SERVER_REGION.USA;
  }

  loadPrivateCloudIpOffers(serviceName) {
    const countries = this.orderableIpCountries.map((code) => {
      return {
        code: code.toUpperCase(),
        description: this.$translate.instant(`country_${code.toUpperCase()}`),
        icon: `oui-flag oui-flag_${code}`,
      };
    });

    return this.Ipv4AgoraOrder.getPrivateCloudIpOffers(serviceName).then(
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

  /* To be replaced once we have region list coming from API for the Vrack, as of now consider IPV6 regions */
  getIpv6RegionsWithPlan(IpOffers) {
    this.IP_REGION = 'ip_region';
    return IpOffers.map((plan) => {
      const {
        details: {
          product: { configurations },
        },
      } = plan;
      const regionConfig = configurations.find(
        (config) => config.name === this.IP_REGION,
      );

      return regionConfig.values.map((regionId) => ({
        regionId,
        plan: plan.planCode,
      }));
    }).flat();
  }

  static getMacroRegion(region) {
    const localZonePattern = /^lz/i;
    const devZonePattern = /^1-/i;

    let macro;
    const local = region
      .split('-')
      ?.slice(2)
      ?.join('-');

    if (devZonePattern.test(local)) {
      macro = [local];
    } else {
      const nbOfSlice = localZonePattern.test(local) ? 3 : 2;
      macro = /[\D]{2,3}/.exec(
        region
          .split('-')
          ?.slice(nbOfSlice)
          ?.join('-'),
      );
    }

    return (macro && macro[0]) || '';
  }

  onIpServiceSelection() {
    this.isParkingIpOrVrack =
      this.model?.selectedService?.type === PRODUCT_TYPES.parking.typeName ||
      this.model?.selectedService?.type === PRODUCT_TYPES.vrack.typeName;
    this.IpOffers = this.ipCatalog.filter((plan) =>
      /^ip-v4|^ip-failover/.test(plan.planCode),
    );
    if (this.model?.selectedService?.type === PRODUCT_TYPES.parking.typeName) {
      this.loading.region = true;
      const DATACENTERS = this.IpOffers.map((ipOffer) => {
        return ipOffer.details.product.configurations.find(
          (config) => config.name === 'datacenter',
        )?.values;
      }).flat();
      const uniqueDatacenters = [...new Set(DATACENTERS)];
      this.catalogByLocation = uniqueDatacenters.map((datacenter) => {
        const flag =
          datacenter === 'ERI' ? 'gb' : DATACENTER_TO_COUNTRY[datacenter];
        return {
          datacenter,
          regionName: DATACENTER_TO_REGION[datacenter],
          location: this.$translate.instant(
            `ip_agora_ipv6_location_${DATACENTER_TO_REGION[datacenter]}`,
          ),
          icon: `oui-flag oui-flag_${flag}`,
        };
      });
      this.loading.region = false;
      return null;
    }

    if (this.model?.selectedService?.type === PRODUCT_TYPES.vrack.typeName) {
      this.loading.region = true;
      this.Ipv6Offers = this.ipCatalog.filter(
        (plan) => plan.planCode.match(/^ip-v6.*/) != null,
      );
      /* To be replaced once we have region list coming from API for the Vrack, as of now consider IPV6 regions */
      this.ipv6RegionsWithPlan = this.getIpv6RegionsWithPlan(this.Ipv6Offers);
      this.catalogByLocation = this.ipv6RegionsWithPlan.map(({ regionId }) => {
        const datacenter = REGION_TO_DATACENTER[regionId];
        const flag =
          datacenter === 'ERI' ? 'gb' : DATACENTER_TO_COUNTRY[datacenter];
        return {
          datacenter,
          regionName: regionId,
          location: this.$translate.instant(
            `ip_agora_ipv6_location_${regionId}`,
          ),
          icon: `oui-flag oui-flag_${flag}`,
        };
      });
      this.loading.region = false;
      return null;
    }
    return this.manageLoadIpOffers();
  }

  manageLoadIpOffers() {
    if (this.model.selectedRegion) {
      this.trackClick(
        `select_region::next_${this.model.selectedRegion.location.replaceAll(
          ' ',
          '-',
        )}`,
      );
    }
    this.loading.ipOffers = true;
    this.ipOffers = [];
    this.failoverIpOffers = [];
    this.blockIpOffers = [];

    const { serviceName } = this.model.selectedService;

    if (
      this.model?.selectedService?.type ===
      PRODUCT_TYPES.dedicatedServer.typeName
    ) {
      return this.Ipv4AgoraOrder.checkIpDedicatedServerIsOrderable(
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
      return this.Ipv4AgoraOrder.getOrderableIpCountries(serviceName).then(
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
    let failoverIpOfferDetails;
    let blockIpOfferDetails;

    const REGION = AgoraIpV4OrderController.getRegionFromServiceName(
      this.model.selectedService.serviceName,
    );
    const serviceRegion =
      this.model.region &&
      AgoraIpV4OrderController.getRegionFromServiceRegion(this.model.region);

    this.isPrivateCloudOffer =
      this.model?.selectedService?.type === PRODUCT_TYPES.privateCloud.typeName;

    if (this.isPrivateCloudOffer) {
      ipOffersPromise = this.loadPrivateCloudIpOffers(
        get(this.model, 'selectedService.serviceName'),
      );
    } else if (this.isParkingIpOrVrack) {
      // Country for Single IP selection in parking
      const country = [
        DATACENTER_TO_COUNTRY[this.model.selectedRegion.datacenter],
      ];
      // Multiple countries are available for block IP selection in parking and vrack
      const countries = AgoraIpV4OrderController.getCountriesFromDatacenter(
        this.model.selectedRegion.datacenter,
        this.IpOffers,
      ).map((value) => value.toLowerCase());
      const ipOfferDetails = this.IpOffers.map(this.createOfferDto.bind(this));
      const ipOffersByDatacenter = AgoraIpV4OrderController.getRegionFromDatacenter(
        this.model.selectedRegion.datacenter,
      );

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
      this.failoverIpOffers = this.getOfferDetails(
        failoverIpOfferDetails,
        ipOffersByDatacenter,
        country,
      );
      this.blockIpOffers = this.getOfferDetails(
        blockIpOfferDetails,
        ipOffersByDatacenter,
        countries,
      ).sort((a, b) => a.price.value - b.price.value);
    } else {
      ipOffersPromise = this.Ipv4AgoraOrder.getIpOffers(
        this.user.ovhSubsidiary,
        this.catalogName,
      ).then((ipOffers) => {
        const ipOfferDetails = ipOffers
          .filter((plan) => /^ip-v4|^ip-failover/.test(plan.planCode))
          .map(this.createOfferDto.bind(this));
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

        const ipCountryAvailablePromise = this.Ipv4AgoraOrder.getIpCountryAvailablePromise(
          this.model.selectedService.serviceName,
          this.model.selectedService.type,
        );

        return ipCountryAvailablePromise
          .then((data) => {
            let countries = data;
            if (data.length === 0) {
              countries = IP_LOCATION_GROUPS.find((group) =>
                group.labels.includes(REGION),
              )?.countries;
            }
            const ipOffersByRegion = AgoraIpV4OrderController.getRegionsOffers(
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
            this.ipOffers = AgoraIpV4OrderController.filterOfferDetailsFromServiceName(
              ipOfferDetails,
              this.model.selectedService.serviceName,
            );
          });
      });
    }

    const ipOrganisationPromise = this.IpOrganisation.getIpOrganisation().then(
      (organisations) => {
        let registry = null;

        switch (serviceRegion) {
          case SERVER_REGION.EUROPE:
            registry = ORGANISATION_GROUP.RIPE;
            break;
          case SERVER_REGION.USA:
          case SERVER_REGION.CANADA:
            registry = ORGANISATION_GROUP.ARIN;
            break;
          default:
            registry = null;
        }

        this.organisations = registry
          ? organisations.filter((org) => org.registry === registry)
          : organisations;
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
      productRegion: AgoraIpV4OrderController.getRegionFromServiceName(
        serviceName,
      ),
    });
  }

  getIpOfferRegions() {
    return uniq(map(this.ipOffers, 'productRegion')).sort();
  }

  onSelectedOfferChange(selectedOffer) {
    this.model.selectedOffer = selectedOffer;
    this.maxSize = IP_AGORA[selectedOffer].maxQty;
    this.minSize = IP_AGORA[selectedOffer].minQty;
    this.model.params.selectedQuantity = this.minSize;
    this.model.params.selectedOrganisation = null;
    this.model.params.selectedCountry = null;
    if (get(this.model, 'params.selectedOffer.countries.length') === 1) {
      this.model.params.selectedCountry = head(
        get(this.model, 'params.selectedOffer.countries'),
      );
    } else if (this.isParkingIpOrVrack) {
      const code = DATACENTER_TO_COUNTRY[this.model.selectedRegion.datacenter];
      this.model.params.selectedCountry = {
        code: code.toUpperCase(),
        description: this.$translate.instant(`country_${code.toUpperCase()}`),
        icon: `oui-flag oui-flag_${code}`,
      };
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
    const { params } = this.model;
    const countryCode = params.selectedCountry?.code || null;
    const orderableIpCountry =
      countryCode || get(this.orderableIpCountries, '[0]', '');
    const commonProductProps = {
      destination: get(this.model, 'selectedService.serviceName'),
      country: orderableIpCountry,
      planCode: get(this.model.params, 'selectedOffer.planCode'),
      quantity: get(this.model.params, 'selectedQuantity', 1),
    };

    let productToOrder = null;
    if (this.isPrivateCloudOffer) {
      productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
        productId: 'privateCloud',
        duration: get(this.model.params, 'selectedOffer.duration'),
        pricingMode: get(this.model.params, 'selectedOffer.pricingMode'),
        serviceName: get(this.model, 'selectedService.serviceName'),
        ...commonProductProps,
      });
    } else if (
      this.model?.selectedService?.type === PRODUCT_TYPES.parking.typeName
    ) {
      const { datacenter } = this.model.selectedRegion;
      productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
        organisation: this.model.params.selectedOrganisation?.organisationId,
        ...commonProductProps,
        country: params.selectedCountry?.code,
        datacenter,
      });
    } else if (
      this.model?.selectedService?.type === PRODUCT_TYPES.vrack.typeName
    ) {
      const { datacenter } = this.model.selectedRegion;
      productToOrder = this.IpAgoraOrder.constructor.createProductToOrder({
        organisation: this.model.params.selectedOrganisation.organisationId,
        ...commonProductProps,
        productRegionName: this.model.params.selectedOffer.productRegion,
        datacenter,
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

    const setup = `${commonProductProps.destination}_${orderableIpCountry ||
      params.selectedCountry?.code ||
      ''}_${productToOrder.planCode}`;
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}button::add_additional_ip::confirm::ipv4_${setup}`,
      type: 'action',
      level2: 57,
    });

    return this.User.getUrlOf('express_order')
      .then((url) => {
        this.$window.open(
          `${url}review?products=${JSURL.stringify([productToOrder])}`,
          '_blank',
        );
      })
      .catch((err) => {
        this.atInternet.trackClick({
          name: `${TRACKING_PREFIX}ip::banner-error::add_additional_ip_error::${err}`,
          type: 'display',
          level2: 57,
        });
        this.Alerter.error(
          this.$translate.instant('ip_order_finish_error'),
          this.ALERT_ID,
        );
        return this.$state
          .go(DASHBOARD_STATE_NAME)
          .then(() => this.$q.reject(err));
      })
      .finally(() => this.$state.go(DASHBOARD_STATE_NAME));
  }

  getOfferDetails = (offerDetails, ipOffersByRegion, countryList) => {
    return offerDetails
      .filter(
        ({ productRegion, planCode }) =>
          ipOffersByRegion.includes(productRegion) &&
          !this.constructor.isIpv6Plan(planCode),
      )
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
        PRODUCT_TYPES.dedicatedServer.typeName ||
      this.model.selectedService?.type === PRODUCT_TYPES.parking.typeName
    );
  }

  canShowBlockSelection() {
    return (
      this.model.selectedService?.type ===
        PRODUCT_TYPES.privateCloud.typeName ||
      this.model.selectedService?.type ===
        PRODUCT_TYPES.dedicatedServer.typeName ||
      this.model.selectedService?.type === PRODUCT_TYPES.parking.typeName ||
      this.model.selectedService?.type === PRODUCT_TYPES.vrack.typeName
    );
  }

  static stringLocaleSensitiveComparator(v1, v2) {
    return v1.value.localeCompare(v2.value);
  }

  trackClick(name) {
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}select::add_additional_ip::${name}`,
      type: 'action',
      level2: 57,
    });
  }

  trackSelectLocation(location) {
    this.model.selectedCountry = location;
    this.trackClick(`select_location::next_${location.code}`);
  }

  offerTraking() {
    this.trackClick(`select_solution::next_${this.model.selectedOffer}`);
  }

  locationTraking() {
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}button::add_additional_ip::select_location::next`,
      type: 'action',
      level2: 57,
    });
  }

  resumeOrder() {
    const setup = `${this.model.selectedService.serviceName}_${this.model.selectedRegion.regionName}_${this.model.selectedOffer}`;
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}button::add_additional_ip::cancel::ipv4_${setup}`,
      type: 'action',
      level2: 57,
    });

    return this.$state.go(DASHBOARD_STATE_NAME);
  }
}
