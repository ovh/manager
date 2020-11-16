import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';
import some from 'lodash/some';
import values from 'lodash/values';

import servicePackOptionService from './option/option.service';

import { OPTION_TYPES } from './option/option.constants';

const moduleName = 'ovhManagerPccServicePackService';
export const name = 'ovhManagerPccServicePackService';

const ServicePackService = class ServicePack {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    DedicatedCloud,
    OvhApiDedicatedCloud,
    OvhApiOrder,
    ovhManagerPccServicePackOptionService,
    ovhUserPref,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhManagerPccServicePackOptionService = ovhManagerPccServicePackOptionService;
    this.ovhUserPref = ovhUserPref;
  }

  getNamesForService(serviceName) {
    return this.OvhApiDedicatedCloud.ServicePacks()
      .v6()
      .query({ serviceName }).$promise;
  }

  getServicePacksForDashboardOptions(serviceName, subsidiary) {
    return this.getServicePacks(serviceName, subsidiary).then((servicePacks) =>
      servicePacks.map((servicePack) =>
        ServicePack.turnRawServicePackToServicePackForDashboard(servicePack),
      ),
    );
  }

  static turnRawServicePackToServicePackForDashboard(servicePack) {
    return {
      ...servicePack,
      basicOptions: reduce(
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
    return filter(options, (option) =>
      isEqual(option.type, OPTION_TYPES.basic),
    );
  }

  static keepOnlyCertification(options) {
    const matchingCertification = find(options, (option) =>
      isEqual(option.type, OPTION_TYPES.certification),
    );

    return matchingCertification
      ? {
          ...matchingCertification,
          exists: true,
        }
      : { exists: false };
  }

  getServicePacks(serviceName, subsidiary) {
    const buildChunkFromName = (servicePackName) =>
      this.ovhManagerPccServicePackOptionService
        .getOptions({
          serviceName,
          servicePackName,
          subsidiary,
        })
        .then((options) => ({
          name: servicePackName,
          options,
        }));

    const buildFromChunk = (chunk) => ({
      ...chunk,
      description: this.$translate.instant(
        `dedicatedCloudDashboardTilesOptionsServicePack_description_${chunk.name}`,
      ),
      displayName: this.$translate.instant(
        `dedicatedCloudDashboardTilesOptionsServicePack_displayName_${chunk.name}`,
      ),
      fullDisplayName: this.$translate.instant(
        `dedicatedCloudDashboardTilesOptionsServicePack_fullDisplayName_${chunk.name}`,
      ),
      type: ServicePack.computeType(chunk),
    });

    return this.getNamesForService(serviceName)
      .then((names) => this.$q.all(names.map(buildChunkFromName)))
      .then((chunks) => chunks.map(buildFromChunk));
  }

  static computeType(servicePack) {
    return find(
      servicePack.options,
      (option) => option.type === OPTION_TYPES.certification,
    )
      ? OPTION_TYPES.certification
      : OPTION_TYPES.basicOptions;
  }

  static removeCurrentServicePack(servicePacks, currentServicePackName) {
    return reject(servicePacks, { name: currentServicePackName });
  }

  static keepOnlyCertainOptionType(servicePacks, optionTypeToKeep) {
    return filter(servicePacks, (servicePack) =>
      some(servicePack.options, (option) =>
        isEqual(option.type, optionTypeToKeep),
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
    return this.$http
      .get('/sws/dedicatedcloud/catalog', {
        serviceType: 'aapi',
        params: {
          ovhSubsidiary,
        },
      })
      .then((catalog) => catalog.data);
  }

  static getAddonsFromCatalogForFamilyName(catalog, family) {
    return find(catalog.plans[0].addonsFamily, { family }).addons;
  }

  static getPricingsFromAddonsForPlanCode(addons, planCode) {
    return find(
      addons,
      (addon) => head(addon.plan.planCode.split('-consumption')) === planCode,
    ).plan.details.pricings;
  }

  static getPricingFromPricingsForServicePackName(pricings, servicePackName) {
    return pricings[`pcc-servicepack-${servicePackName}`][0];
  }

  static getHostsOfBillingType(hosts, billingType) {
    return filter(hosts, { billingType });
  }

  static computeNumberOfHostsPerProfileCode(hosts) {
    return reduce(
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
    return this.getCatalog(ovhSubsidiary).then((catalog) => {
      const addons = {
        hourly: ServicePack.getAddonsFromCatalogForFamilyName(
          catalog,
          'host-hourly',
        ),
        monthly: ServicePack.getAddonsFromCatalogForFamilyName(catalog, 'host'),
      };

      return map(servicePacks, (servicePack) => {
        const price = reduce(
          filter(hosts, (host) => host.billingType !== 'freeSpare'),
          (acc, host) => {
            const pricing = ServicePack.getPricingFromPricingsForServicePackName(
              ServicePack.getPricingsFromAddonsForPlanCode(
                addons[host.billingType],
                host.profileCode,
              ),
              servicePack.name,
            );

            acc[host.billingType] =
              (acc[host.billingType] || 0) + pricing.price.value;
            acc.currencyCode = pricing.price.currencyCode;

            return acc;
          },
          {},
        );

        return {
          ...servicePack,
          price,
        };
      });
    });
  }

  getHosts(serviceName) {
    return this.DedicatedCloud.getDatacentersInformations(
      serviceName,
    ).then((datacenters) =>
      reduce(
        map(datacenters.list.results, 'hosts'),
        (acc, host) => flatten([...acc, values(host)]),
        [],
      ),
    );
  }
};

angular
  .module(moduleName, [servicePackOptionService])
  .service(name, ServicePackService);

export default moduleName;
