import get from 'lodash/get';
import {
  PRIVATE_REGISTRY_CREATE_PLAN,
  PRIVATE_REGISTRY_CREATE_LOCATION_NEXT,
} from './constants';

export default class {
  /* @ngInject */
  constructor($translate, pciPrivateRegistryService) {
    this.$translate = $translate;
    this.privateRegistryService = pciPrivateRegistryService;
  }

  $onInit() {
    this.loading = false;
    this.registry = {};
    this.selectedPlan = null;
  }

  create() {
    this.loading = true;
    this.registry.region = this.registry.region.name;
    this.trackClick(`${PRIVATE_REGISTRY_CREATE_PLAN}${this.selectedPlan}`);
    return this.privateRegistryService
      .create(this.projectId, this.registry)
      .then(() =>
        this.goBack({
          text: this.$translate.instant('private_registry_onboarding_success', {
            registryName: this.registry.name,
          }),
        }),
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

  getAvailablePlans() {
    this.trackClick(PRIVATE_REGISTRY_CREATE_LOCATION_NEXT);
    this.availablePlans = this.plans(this.registry.region.name);
  }

  changeMethod(value) {
    this.selectedPlan = value.name;
    this.registry.planID = value.id;
  }
}
