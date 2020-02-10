import get from 'lodash/get';
import map from 'lodash/map';
import template from 'lodash/template';

export default class {
  /* @ngInject */
  constructor($translate, pciPrivateRegistryService) {
    this.$translate = $translate;
    this.privateRegistryService = pciPrivateRegistryService;
    this.loading = false;
    this.registry = {};
  }

  create() {
    this.loading = true;
    return this.privateRegistryService
      .acceptAgreements(this.registryContracts)
      .then(() =>
        this.privateRegistryService
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
          ),
      );
  }

  getCompiledLinks(linkTemplate) {
    return map(this.registryContracts, (contract) => {
      const compile = template(linkTemplate);
      return compile(contract);
    }).join(', ');
  }

  getAvailablePlans() {
    this.registry.region = this.registry.region.name;
    this.availablePlans = this.plans(this.registry.region);
  }

  changeMethod(value) {
    this.registry.planID = value.code;
  }
}
