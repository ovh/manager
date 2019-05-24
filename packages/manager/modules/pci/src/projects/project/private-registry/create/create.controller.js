import get from 'lodash/get';
import { REGION } from '../private-registry.constants';

export default class {
  /* @ngInject */
  constructor($stateParams, $translate, privateRegistryService) {
    this.$translate = $translate;
    this.privateRegistryService = privateRegistryService;
    this.fromState = $stateParams.fromState;
    this.isLoading = false;
    this.REGION = REGION;
    this.registry = {};
  }

  createRegistry() {
    this.isLoading = true;
    this.registry.region = this.REGION; // only GRA7 supported as of now
    return this.privateRegistryService.createRegistry(this.projectId, this.registry)
      .then(res => this.goBack(
        this.$translate.instant('private_registry_onboarding_success', { registryName: this.registry.name }),
        'success',
        this.fromState,
        res.id,
      ))
      .catch(error => this.goBack(
        this.$translate.instant('private_registry_onboarding_error', {
          message: get(error, 'data.message'),
        }),
        'error',
        this.fromState,
      ));
  }

  back() {
    this.goBack(null, null, this.fromState);
  }
}
