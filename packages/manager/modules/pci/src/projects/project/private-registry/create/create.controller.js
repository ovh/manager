import get from 'lodash/get';
import map from 'lodash/map';
import template from 'lodash/template';
import { REGION } from '../private-registry.constants';

export default class {
  /* @ngInject */
  constructor($translate, pciPrivateRegistryService) {
    this.$translate = $translate;
    this.privateRegistryService = pciPrivateRegistryService;
    this.isLoading = false;
    this.REGION = REGION;
    this.registry = {};
  }

  create() {
    this.isLoading = true;
    this.registry.region = this.REGION;
    return this.privateRegistryService
      .create(this.projectId, this.registry)
      .then((res) =>
        this.goBack(
          this.$translate.instant('private_registry_onboarding_success', {
            registryName: this.registry.name,
          }),
          'success',
          res.id,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('private_registry_onboarding_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  getCompiledLinks(linkTemplate) {
    return map(this.registryContracts, (contract) => {
      const compile = template(linkTemplate);
      return compile(contract);
    }).join(', ');
  }

  back() {
    this.goBack(null, null);
  }
}
