import get from 'lodash/get';

export default class PciServingNamespaceTokensDeleteController {
  /* @ngInject */
  constructor($translate, OvhManagerPciServingTokensService) {
    this.$translate = $translate;
    this.OvhManagerPciServingTokensService = OvhManagerPciServingTokensService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteToken() {
    this.isDeleting = true;
    return this.OvhManagerPciServingTokensService.delete(
      this.projectId,
      this.namespaceId,
      { id: this.tokenId },
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_serving_namespace_tokens_delete_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_serving_namespace_tokens_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
