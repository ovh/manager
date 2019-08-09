import _ from 'lodash';

import config from '../../../../../config/config';
import { OPTIONS } from './option.constants';

export const name = 'ovhManagerPccServicePackOptionService';

export const OvhManagerPccServicePackOptionService = class OvhManagerPccServicePackOptionService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiDedicatedCloud,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
  }

  fetchAllExistingOptionNames(serviceName) {
    return this.OvhApiDedicatedCloud.ServicePacks().v6()
      .query({ serviceName }).$promise
      .then(
        servicePackNames => this.mapServicePackNamesToOptionNames(serviceName, servicePackNames),
      )
      .then(optionNames => _
        .uniq(
          _.flatten(optionNames),
        )
        .sort());
  }

  mapServicePackNamesToOptionNames(serviceName, servicePackNames) {
    return this.$q.all(
      servicePackNames
        .map(servicePackName => this.fetchOptionNames(serviceName, servicePackName)),
    );
  }

  fetchOptionNames(serviceName, servicePackName) {
    return this.OvhApiDedicatedCloud.ServicePacks().v6()
      .get({
        name: servicePackName,
        serviceName,
      }).$promise
      .then(({ options: names }) => names);
  }

  static getType(optionName) {
    return _.find(
      OPTIONS, { name: optionName },
    ).type;
  }

  static getDiscoverURL(optionName, subsidiary) {
    return _.get(config.constants.URLS, subsidiary, 'FR').presentations[optionName];
  }

  fetchRawOptions({ serviceName, servicePackName, subsidiary }) {
    return this
      .fetchOptionNames(serviceName, servicePackName)
      .then(names => this.$q.all(names.map(optionName => ({
        name: optionName,
        descriptionURL: OvhManagerPccServicePackOptionService
          .getDiscoverURL(optionName, subsidiary),
      }))));
  }

  fetchOptions({ serviceName, servicePackName, subsidiary }) {
    return this
      .fetchRawOptions({ serviceName, servicePackName, subsidiary })
      .then(options => options.map(option => ({
        ...option,
        type: OvhManagerPccServicePackOptionService.getType(option.name),
      })));
  }
};

export default {
  name,
  OvhManagerPccServicePackOptionService,
};
