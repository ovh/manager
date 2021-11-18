import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AiTokenService) {
    this.$translate = $translate;
    this.AiTokenService = AiTokenService;
  }

  $onInit() {
    this.isUpdating = false;
  }

  updateToken() {
    this.isUpdating = true;
    return this.AiTokenService.renewToken(this.projectId, this.tokenId)
      .then(({ status }) =>
        this.goBack(
          {
            textHtml: this.$translate.instant('pci_ai_tokens_update_success'),
          },
          'success',
          status.value,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_ai_tokens_update_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
