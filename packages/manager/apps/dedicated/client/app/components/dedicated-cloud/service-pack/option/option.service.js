import find from 'lodash/find';
import get from 'lodash/get';

import { getConstants } from '../../../../config/config';
import { OPTIONS } from './option.constants';

const moduleName = 'ovhManagerPccServicePackOptionService';
export const name = 'ovhManagerPccServicePackOptionService';

const ServicePackOptionService = class ServicePackOptionService {
  /* @ngInject */
  constructor($q, coreConfig, OvhApiDedicatedCloud) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
  }

  mapServicePackNamesToOptionNames(serviceName, servicePackNames) {
    return this.$q.all(
      servicePackNames.map((servicePackName) =>
        this.getOptionNames(serviceName, servicePackName),
      ),
    );
  }

  getOptionNames(serviceName, servicePackName) {
    return this.OvhApiDedicatedCloud.ServicePacks()
      .v6()
      .get({
        name: servicePackName,
        serviceName,
      })
      .$promise.then(({ options: names }) => names);
  }

  static getType(optionName) {
    return find(OPTIONS, { name: optionName })?.type;
  }

  getPresentationUrl(optionName, subsidiary) {
    const urls = getConstants(this.coreConfig.getRegion()).URLS;
    return get(urls, subsidiary, urls.FR).presentations[optionName];
  }

  getRawOptions({ serviceName, servicePackName, subsidiary }) {
    return this.getOptionNames(serviceName, servicePackName).then((names) =>
      this.$q.all(
        names.map((optionName) => ({
          name: optionName,
          presentationUrl: this.getPresentationUrl(optionName, subsidiary),
        })),
      ),
    );
  }

  getOptions({ serviceName, servicePackName, subsidiary }) {
    return this.getRawOptions({
      serviceName,
      servicePackName,
      subsidiary,
    }).then((options) =>
      options.map((option) => ({
        ...option,
        type: ServicePackOptionService.getType(option.name),
      })),
    );
  }
};

angular.module(moduleName, []).service(name, ServicePackOptionService);

export default moduleName;
