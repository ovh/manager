export default class MetricService {
  /* @ngInject */
  constructor($q, $translate, CucCloudMessage, OvhApiMetrics) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.metrics = OvhApiMetrics;
  }

  getService(serviceName) {
    return this.metrics
      .v6()
      .get({
        serviceName,
      })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_err_service'),
        ),
      );
  }

  getServiceInfos(serviceName) {
    return this.metrics
      .v6()
      .getServiceInfos({
        serviceName,
      })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_err_service'),
        ),
      );
  }

  setServiceDescription(serviceName, description) {
    return this.metrics
      .v6()
      .edit(
        {
          serviceName,
        },
        {
          description,
        },
      )
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_setting_updated'),
        ),
      );
  }

  getConsumption(serviceName) {
    return this.metrics
      .v6()
      .getConsumption({
        serviceName,
      })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_err_conso'),
        ),
      );
  }

  getTokens(serviceName) {
    this.metrics
      .Token()
      .v6()
      .resetAllCache();
    return this.metrics
      .Token()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((tokenList) =>
        this.$q.all(
          tokenList.map(
            (tokenID) =>
              this.metrics
                .Token()
                .v6()
                .get({
                  serviceName,
                  tokenID,
                }).$promise,
          ),
        ),
      );
  }

  getToken(serviceName, tokenID) {
    return this.metrics
      .Token()
      .v6()
      .get({
        serviceName,
        tokenID,
      }).$promise;
  }

  addToken(token) {
    return this.metrics
      .Token()
      .v6()
      .save(token)
      .$promise.then((response) => {
        this.metrics
          .Token()
          .v6()
          .resetAllCache();
        return this.acceptResponse(
          response,
          this.$translate.instant('metrics_token_created'),
        );
      })
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_token_err_create'),
        ),
      );
  }

  updateToken(serviceName, tokenID, description) {
    return this.metrics
      .Token()
      .v6()
      .edit({
        serviceName,
        tokenID,
        description,
      })
      .$promise.then((response) => {
        this.metrics
          .Token()
          .v6()
          .resetAllCache();
        return this.acceptResponse(
          response,
          this.$translate.instant('metrics_token_updated'),
        );
      })
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_token_err_create'),
        ),
      );
  }

  deleteToken(serviceName, tokenID) {
    return this.metrics
      .Token()
      .v6()
      .delete({
        serviceName,
        tokenID,
      })
      .$promise.then((response) => {
        this.metrics
          .Token()
          .v6()
          .resetAllCache();
        return this.acceptResponse(
          response,
          this.$translate.instant('metrics_token_revoked'),
        );
      })
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('metrics_err_delete_token'),
        ),
      );
  }

  acceptResponse(data, message) {
    return this.$q.resolve({
      status: 'OK',
      data,
      message: this.CucCloudMessage.success(message),
    });
  }

  rejectResponse(data, message) {
    return this.$q.reject({
      status: 'ERROR',
      data,
      message: this.CucCloudMessage.error(message),
    });
  }
}
