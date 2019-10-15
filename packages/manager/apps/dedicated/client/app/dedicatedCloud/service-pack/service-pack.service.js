import _ from 'lodash';

import { OPTION_TYPES } from './option/option.constants';

export const name = 'ovhManagerPccServicePackService';

export const ServicePackService = class ServicePack {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    DedicatedCloud,
    OvhApiDedicatedCloud,
    OvhApiOrder,
    ovhManagerPccServicePackOptionService,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhManagerPccServicePackOptionService = ovhManagerPccServicePackOptionService;
    this.ovhUserPref = ovhUserPref;
  }

  getNamesForService(serviceName) {
    return this
      .OvhApiDedicatedCloud
      .ServicePacks()
      .v6()
      .query({ serviceName }).$promise;
  }

  getServicePacksForDashboardOptions(serviceName, subsidiary) {
    return this
      .getServicePacks(serviceName, subsidiary)
      .then(servicePacks => servicePacks
        .map(servicePack => ServicePack.turnRawServicePackToServicePackForDashboard(servicePack)));
  }

  static turnRawServicePackToServicePackForDashboard(servicePack) {
    return {
      ...servicePack,
      basicOptions: _.reduce(
        ServicePack.keepOnlyBasicOptions(servicePack.options),
        (prev, curr) => ({
          ...prev,
          [curr.name]: curr,
        }),
        {},
      ),
      certification: ServicePack.keepOnlyCertification(servicePack.options),
    };
  }

  static keepOnlyBasicOptions(options) {
    return _.filter(
      options,
      option => _.isEqual(option.type, OPTION_TYPES.basic),
    );
  }

  static keepOnlyCertification(options) {
    const matchingCertification = _.find(
      options,
      option => _.isEqual(option.type, OPTION_TYPES.certification),
    );

    return matchingCertification
      ? {
        ...matchingCertification,
        exists: true,
      }
      : { exists: false };
  }

  getServicePacks(serviceName, subsidiary) {
    const buildChunkFromName = servicePackName => this
      .ovhManagerPccServicePackOptionService
      .getOptions({
        serviceName,
        servicePackName,
        subsidiary,
      })
      .then(options => ({
        name: servicePackName,
        options,
      }));

    const buildFromChunk = chunk => ({
      ...chunk,
      description: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_description_${chunk.name}`),
      displayName: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_displayName_${chunk.name}`),
      fullDisplayName: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_fullDisplayName_${chunk.name}`),
      type: ServicePack.computeType(chunk),
    });

    return this
      .getNamesForService(serviceName)
      .then(names => this.$q.all(names.map(buildChunkFromName)))
      .then(chunks => chunks.map(buildFromChunk));
  }

  static computeType(servicePack) {
    return _.find(
      servicePack.options,
      option => option.type === OPTION_TYPES.certification,
    )
      ? OPTION_TYPES.certification
      : OPTION_TYPES.basicOptions;
  }

  static removeCurrentServicePack(servicePacks, currentServicePackName) {
    return _.reject(servicePacks, { name: currentServicePackName });
  }

  static keepOnlyCertainOptionType(servicePacks, optionTypeToKeep) {
    return _.filter(
      servicePacks,
      servicePack => _.some(
        servicePack.options,
        option => _.isEqual(option.type, optionTypeToKeep),
      ),
    );
  }

  static keepOnlyOrderableCertificates(servicePacks, currentServicePackName) {
    return this.keepOnlyCertainOptionType(
      this.removeCurrentServicePack(servicePacks, currentServicePackName),
      OPTION_TYPES.certification,
    );
  }

  static keepOnlyOrderableBasicOptions(servicePacks, currentServicePackName) {
    return this.keepOnlyCertainOptionType(
      this.removeCurrentServicePack(servicePacks, currentServicePackName),
      OPTION_TYPES.basic,
    );
  }

  getCatalog(ovhSubsidiary) {
    return this
      .OvhApiOrder
      .CatalogFormatted()
      .v6()
      .get({
        catalogName: 'privateCloud',
        ovhSubsidiary,
      }).$promise;
  }

  static getAddonsFromCatalogForFamilyName(catalog, family) {
    return _.find(
      catalog.plans[0].addonsFamily,
      { family },
    ).addons;
  }

  static getPricingsFromAddonsForPlanCode(addons, planCode) {
    return _.find(
      addons,
      addon => _.head(
        addon.plan.planCode.split('-consumption'),
      ) === planCode,
    ).plan.details.pricings;
  }

  static getPricingFromPricingsForServicePackName(pricings, servicePackName) {
    return pricings[`pcc-servicepack-${servicePackName}`][0];
  }

  static getHostsOfBillingType(hosts, billingType) {
    return _.filter(
      hosts,
      { billingType },
    );
  }

  static computeNumberOfHostsPerProfileCode(hosts) {
    return _.reduce(
      hosts,
      (acc, host) => {
        acc[host.profileCode] = acc[host.profileCode]
          ? acc[host.profileCode] + 1
          : 1;

        return acc;
      },
      {},
    );
  }

  getPrices(ovhSubsidiary, hosts, servicePacks) {
    return this
      .getCatalog(ovhSubsidiary)
      .then((catalog) => {
        const addons = {
          hourly: ServicePack.getAddonsFromCatalogForFamilyName(catalog, 'host-hourly'),
          monthly: ServicePack.getAddonsFromCatalogForFamilyName(catalog, 'host'),
        };

        return _.map(
          servicePacks,
          (servicePack) => {
            const price = _.reduce(
              _.filter(
                hosts,
                host => host.billingType !== 'freeSpare',
              ),
              (acc, host) => {
                const pricing = ServicePack.getPricingFromPricingsForServicePackName(
                  ServicePack.getPricingsFromAddonsForPlanCode(
                    addons[host.billingType],
                    host.profileCode,
                  ),
                  servicePack.name,
                );

                acc[host.billingType] = (acc[host.billingType] || 0) + pricing.price.value;
                acc.currencyCode = pricing.price.currencyCode;

                return acc;
              },
              {},
            );

            return {
              ...servicePack,
              price,
            };
          },
        );
      });
  }

  getHosts(serviceName) {
    return this
      .DedicatedCloud
      .getDatacentersInformations(serviceName)
      .then(datacenters => _.reduce(
        _.map(
          datacenters.list.results,
          'hosts',
        ),
        (acc, host) => _.flatten(
          [...acc, _.values(
            host,
          )],
        ),
        [],
      ));
  }
};

export default {
  name,
  ServicePackService,
};
