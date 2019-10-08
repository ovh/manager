import { ACTIONS } from './tokens.constants';

import Token from './token.class';

export default class PciProjectStreamsTokensService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo) {
    this.$q = $q;
    this.OvhApiCloudProjectIo = OvhApiCloudProjectIo;
  }

  getAll(projectId, stream) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Token()
      .v6()
      .query({
        serviceName: projectId,
        streamId: stream.id,
      })
      .$promise
      .then(tokens => this.$q.all(
        tokens.map(tokenId => this.get(projectId, stream, tokenId)),
      ));
  }

  get(projectId, stream, tokenId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Token()
      .v6()
      .get({
        serviceName: projectId,
        streamId: stream.id,
        tokenId,
      })
      .$promise
      .then(token => new Token({
        ...token,
      }));
  }

  regenerateTokens(projectId, stream) {
    return this.deleteAll(projectId, stream)
      .then(() => this.createTokens(projectId, stream));
  }

  deleteAll(projectId, stream) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Token()
      .v6()
      .query({
        serviceName: projectId,
        streamId: stream.id,
      })
      .$promise
      .then(tokens => this.$q.all(
        tokens.map(tokenId => this.delete(projectId, stream, tokenId)),
      ));
  }

  delete(projectId, { id: streamId }, tokenId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Token()
      .v6()
      .delete({
        serviceName: projectId,
        streamId,
        tokenId,
      })
      .$promise;
  }

  createTokens(projectId, stream) {
    return this.$q.all([
      this.create(projectId, stream, ACTIONS.BOTH),
      this.create(projectId, stream, ACTIONS.CONSUME),
    ]);
  }

  create(projectId, { id: streamId }, action) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Token()
      .v6()
      .save({
        serviceName: projectId,
        streamId,
      }, {
        action,
      })
      .$promise;
  }
}
