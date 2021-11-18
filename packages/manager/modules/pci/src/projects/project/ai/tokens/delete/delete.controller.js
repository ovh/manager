import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AiTokenService) {
    this.$translate = $translate;
    this.AiTokenService = AiTokenService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteToken() {
    this.isDeleting = true;
    return this.AiTokenService.deleteToken(this.projectId, this.tokenId)
      .then(() =>
        this.goBack(this.$translate.instant('pci_ai_tokens_delete_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_ai_tokens_delete_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
