import camelCase from 'lodash/camelCase';
import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import reject from 'lodash/reject';
import some from 'lodash/some';
import sum from 'lodash/sum';

import { OPTION_TYPES } from './option/option.constants';
import { PREFERENCE_NAME } from '../preference/preference.constants';

export const name = 'ovhManagerPccServicePackService';

export const OvhManagerPccServicePackService = class OvhManagerPccServicePackService {
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

  fetchNamesForService(serviceName) {
    return this.OvhApiDedicatedCloud.ServicePacks().v6()
      .query({ serviceName }).$promise;
  }

  buildAllForService(serviceName, subsidiary) {
    const buildChunkFromName = servicePackName => this.ovhManagerPccServicePackOptionService
      .fetchOptions({
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
      displayName: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_name_${chunk.name}`),
      description: this.$translate.instant(`dedicatedCloudDashboardTilesOptionsServicePack_description_${chunk.name}`),
    });

    return this
      .fetchNamesForService(serviceName)
      .then(names => this.$q.all(names.map(buildChunkFromName)))
      .then(chunks => chunks.map(buildFromChunk));
  }

  static removeCurrentServicePack(servicePacks, currentServicePackName) {
    return reject(servicePacks, { name: currentServicePackName });
  }

  static keepOnlyCertainOptionType(servicePacks, optionTypeToKeep) {
    return filter(
      servicePacks,
      servicePack => some(
        servicePack.options,
        option => isEqual(option.type, optionTypeToKeep),
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

  fetchOrderable({
    activationType,
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    const servicePackTypeCamelCase = camelCase(activationType);
    const formattedServicePackType = `${servicePackTypeCamelCase[0].toUpperCase()}${servicePackTypeCamelCase.slice(1)}`;
    const methodToCallName = `fetchOrderable${formattedServicePackType}`;
    const methodToCall = this[methodToCallName].bind(this);

    if (!isFunction(methodToCall)) {
      throw new Error(`DedicatedCloudServicePack.fetchOrderable: method "${methodToCallName}" does not exist`);
    }

    return methodToCall({
      currentServicePackName,
      serviceName,
      subsidiary,
    });
  }

  fetchOrderableCertification({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.buildAllForService(serviceName, subsidiary)
      .then(servicePacks => OvhManagerPccServicePackService
        .keepOnlyOrderableCertificates(servicePacks, currentServicePackName));
  }

  fetchOrderableBasic({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.buildAllForService(serviceName, subsidiary)
      .then(servicePacks => filter(
        reject(servicePacks, { name: currentServicePackName }),
        servicePack => every(
          servicePack.options,
          option => isEqual(option.type, OPTION_TYPES.basic),
        ),
      ));
  }

  fetchPrices(ovhSubsidiary, hostFamilies, servicePacks) {
    return this.OvhApiOrder.CatalogFormatted().v6()
      .get({
        catalogName: 'privateCloud',
        ovhSubsidiary,
      }).$promise
      .then((catalog) => {
        const addonsFamily = find(catalog.plans[0].addonsFamily, { family: 'host' });

        return servicePacks.map((product) => {
          let price = null;
          const value = sum(
            map(
              Object.entries(hostFamilies),
              ([familyName, numberOfHosts]) => {
                const familyData = find(
                  addonsFamily.addons,
                  addon => addon.plan.planCode === familyName,
                );

                const localPrice = familyData.plan.details.pricings[`pcc-servicepack-${product.name}`][0].price;
                price = localPrice;

                return numberOfHosts * localPrice.value;
              },
            ),
          );

          return {
            ...product,
            price: {
              ...price,
              value,
            },
          };
        });
      });
  }

  fetchHostFamilies(serviceName) {
    return this.DedicatedCloud
      .getDatacentersInformations(serviceName)
      .then(datacenters => datacenters.list.results
        .reduce((accumulator, { hostFamilies }) => ({ ...accumulator, ...hostFamilies }), {}));
  }

  savePendingOrder(serviceName, {
    activationType, id, needsConfiguration, orderedServicePackName, url,
  }) {
    return this.ovhUserPref
      .assign(PREFERENCE_NAME, {
        [serviceName]: {
          activationType,
          id,
          needsConfiguration,
          orderedServicePackName,
          url,
        },
      });
  }
};

export default {
  name,
  OvhManagerPccServicePackService,
};
