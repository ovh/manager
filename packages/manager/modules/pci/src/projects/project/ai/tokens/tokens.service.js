import Token from './token.class';

export default class AiTokenService {
  static getIcebergHeaders() {
    return {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
        Pragma: 'no-cache',
      },
    };
  }

  /* @ngInject */
  constructor($http, ovhManagerRegionService) {
    this.$http = $http;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  getTokens(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/token`,
        AiTokenService.getIcebergHeaders(),
      )
      .then(({ data }) =>
        data.map(
          (token) =>
            new Token(
              token,
              this.ovhManagerRegionService.getTranslatedMacroRegion(
                token.spec?.region,
              ),
            ),
        ),
      );
  }

  addToken(serviceName, token) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/token`, token)
      .then(({ data }) => data);
  }

  deleteToken(serviceName, tokenId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/ai/token/${tokenId}`)
      .then(({ data }) => data);
  }

  renewToken(serviceName, tokenId) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/token/${tokenId}/renew`)
      .then(({ data }) => data);
  }
}
