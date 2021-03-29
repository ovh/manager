import Token from './token.class';

export default class OvhManagerPciServingTokenService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  add(serviceName, namespaceId, tokenCreation) {
    return this.OvhApiCloudProjectAi.Serving().Token().v6().save(
      {
        serviceName,
        namespaceId,
      },
      tokenCreation,
    ).$promise;
  }

  update(serviceName, namespaceId, tokenId) {
    return this.OvhApiCloudProjectAi.Serving().Token().v6().edit(
      {
        serviceName,
        namespaceId,
        tokenId,
      },
      null,
    ).$promise;
  }

  getAll(serviceName, namespaceId) {
    return this.OvhApiCloudProjectAi.Serving()
      .Token()
      .v6()
      .query({
        serviceName,
        namespaceId,
      })
      .$promise.then((tokens) =>
        tokens.map((token) => new Token({ ...token })),
      );
  }

  get(serviceName, namespaceId, tokenId) {
    return this.OvhApiCloudProjectAi.Serving()
      .Token()
      .v6()
      .get({
        serviceName,
        namespaceId,
        tokenId,
      })
      .$promise.then(
        (token) =>
          new Token({
            ...token,
          }),
      );
  }

  delete(serviceName, namespaceId, { id: tokenId }) {
    return this.OvhApiCloudProjectAi.Serving().Token().v6().delete({
      serviceName,
      namespaceId,
      tokenId,
    }).$promise;
  }
}
