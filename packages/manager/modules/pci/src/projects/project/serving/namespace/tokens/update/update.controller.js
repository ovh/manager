import get from 'lodash/get';

export default class PciServingNamespaceTokensUpdateController {
  /* @ngInject */
  constructor(
    $translate,
    OvhManagerPciServingTokensService,
  ) {
    this.$translate = $translate;
    this.OvhManagerPciServingTokensService = OvhManagerPciServingTokensService;
  }

  $onInit() {
    this.isUpdating = false;
  }

  updateToken() {
    this.isUpdating = true;
    return this.OvhManagerPciServingTokensService.update(
      this.projectId,
      this.namespaceId,
      this.tokenId,
    )
      .then(({ token }) => this.goBack({
        textHtml: this.$translate.instant('pci_projects_project_serving_namespace_tokens_update_success'),
      }, 'success', token))
      .catch((error) => this.goBack(
        this.$translate.instant('pci_projects_project_serving_namespace_tokens_update_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
