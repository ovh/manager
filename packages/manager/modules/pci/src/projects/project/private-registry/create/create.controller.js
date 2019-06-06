import get from 'lodash/get';
import { REGION } from '../private-registry.constants';

export default class {
  /* @ngInject */
  constructor($state, $translate, pciPrivateRegistryService) {
    this.$state = $state;
    this.$translate = $translate;
    this.privateRegistryService = pciPrivateRegistryService;
    this.isLoading = false;
    this.REGION = REGION;
    this.registry = {};
    this.showAcceptOption = false;
  }

  $onInit() {
    if (!this.$state.current.name.includes('onboarding')) {
      this.showAcceptOption = true;
    }
  }

  createRegistry() {
    this.isLoading = true;
    this.registry.region = this.REGION; // only GRA7 supported as of now
    return this.privateRegistryService.acceptContract(this.contractInfo.id)
      .then(() => this.privateRegistryService.createRegistry(this.projectId, this.registry)
        .then(res => this.goBack(
          this.$translate.instant('private_registry_onboarding_success', { registryName: this.registry.name }),
          'success',
          res.id,
        ))
        .catch(error => this.goBack(
          this.$translate.instant('private_registry_onboarding_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        )))
      .catch(error => this.goBack(
        this.$translate.instant('private_registry_onboarding_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }

  back() {
    this.goBack(null, null);
  }
}
