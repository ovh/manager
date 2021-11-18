import get from 'lodash/get';

import { ROLES } from '../tokens.constants';

export default class {
  /* @ngInject */
  constructor($translate, AiTokenService) {
    this.$translate = $translate;
    this.AiTokenService = AiTokenService;
    this.ROLES = ROLES;
  }

  $onInit() {
    this.isAdding = false;
    this.token = {
      name: null,
      labelSelector: null,
      role: ROLES[0],
      region: this.regions[0].id,
    };
  }

  addToken() {
    this.isAdding = true;

    return this.AiTokenService.addToken(this.projectId, this.token)
      .then(({ status }) =>
        this.goBack(
          {
            textHtml: this.$translate.instant('pci_ai_tokens_add_success'),
          },
          'success',
          status.value,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_ai_tokens_add_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
