import get from 'lodash/get';
import App from './App.class';

export default class AppService {
  static buildGetAppUrl(serviceName, appId) {
    return `/cloud/project/${serviceName}/ai/app/${appId}`;
  }

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
  constructor(
    $http,
    Poller,
    OvhApiCloudProjectAi,
    OvhApiCloudProjectStorage,
    $q,
    coreConfig,
  ) {
    this.$http = $http;
    this.Poller = Poller;
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
    this.OvhApiCloudProjectStorage = OvhApiCloudProjectStorage;
    this.$q = $q;

    this.PriceFormatter = new Intl.NumberFormat(
      coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: coreConfig.getUser().currency.code,
        maximumFractionDigits: 2,
      },
    );
  }

  pollAppStatus(serviceName, appId) {
    return this.Poller.poll(
      AppService.buildGetAppUrl(serviceName, appId),
      {},
      {
        namespace: `apps_${serviceName}_${appId}`,
        method: 'get',
        successRule: (app) => !new App(app).isPending(),
      },
    );
  }

  stopPollingAppStatus(serviceName, appId) {
    this.Poller.kill({ namespace: `apps_${serviceName}_${appId}` });
  }

  getAppConfigurationCommand(serviceName, appSpecs) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app/command`, appSpecs)
      .then(({ data }) => data.command);
  }

  getApps(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getApp(serviceName, appId) {
    return this.$http
      .get(AppService.buildGetAppUrl(serviceName, appId))
      .then(({ data }) => data);
  }

  addApp(serviceName, app) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app`, app)
      .then(({ data }) => data);
  }

  updateApp(serviceName, appId, app) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}`, app)
      .then(({ data }) => data);
  }

  removeApp(serviceName, appId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/ai/app/${appId}`)
      .then(({ data }) => data);
  }

  startApp(serviceName, appId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/start`)
      .then(({ data }) => data);
  }

  stopApp(serviceName, appId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/stop`)
      .then(({ data }) => data);
  }

  getRegions(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFlavors(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/flavor`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getPresets() {
    // return this.$http
    //   .get(
    //     `/cloud/project/${serviceName}/ai/capabilities/region/${region}/presets`,
    //     AppService.getIcebergHeaders(),
    //   )
    //   .then(({ data }) => data);
    const defer = this.$q.defer();
    defer.resolve([
      {
        id: 'huggingface/translate-en-fr-infinity',
        description: 'Powered by Hugging Face Infinity',
        name: 'Translate EN-FR',
        type: 'app',
        capabilities: {
          volume: true,
          exec: false,
          log: true,
          ssh: false,
        },
        partner: {
          id: 'huggingface',
          name: 'Hugging Face',
          flavor: 'huggingface-infinity',
        },
        flavorTypes: ['cpu', 'gpu'],
        docUrl: 'https://hub.docker.com/r/ovhcom/ai-training-transformers',
        logoUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_811aaa421cdf4cf1b3507d4d2143f461/logo/huggingface.svg',
      },
      {
        id: 'huggingface/translate-fr-en-infinity',
        description: 'Powered by Hugging Face Infinity',
        name: 'Translate FR-EN',
        type: 'app',
        capabilities: {
          volume: false,
          exec: false,
          log: true,
          ssh: false,
        },
        partner: {
          id: 'huggingface',
          flavor: 'infinity',
          name: 'Hugging Face',
        },
        flavorTypes: ['cpu'],
        docUrl: 'https://hub.docker.com/r/ovhcom/ai-training-transformers',
        logoUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_811aaa421cdf4cf1b3507d4d2143f461/logo/huggingface.svg',
      },
    ]);
    return defer.promise;
  }

  getStorages(serviceName, archive = false, withObjects = false) {
    return this.OvhApiCloudProjectStorage.Aapi().query({
      serviceName,
      archive,
      withObjects,
    }).$promise;
  }

  isAuthorized(serviceName) {
    return this.OvhApiCloudProjectAi.Training()
      .Authorization()
      .v6()
      .get({
        serviceName,
      })
      .$promise.then((authorization) => authorization.authorized);
  }

  authorized(serviceName) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/authorization`)
      .then(({ data }) => data);
  }

  static getPriceIndex(flavorId) {
    return `ai-notebook.${flavorId}.minute.consumption`;
  }

  static getPricePartnerIndex(partnerId, flavorId, type) {
    return `ai-app.${partnerId}-${flavorId}-${type}`;
  }

  getPriceForHour(prices, flavorId) {
    if (flavorId) {
      return this.getPrice(prices, flavorId).price.value * 60;
    }

    return 0;
  }

  getPrice(prices, flavorId) {
    const priceIndex = this.constructor.getPriceIndex(flavorId);
    return get(prices, priceIndex, {
      price: { value: 0 },
      priceInUcents: 0,
      tax: 0,
    });
  }

  getPartnerPrice(prices, partnerId, flavorId, type) {
    const priceIndex = this.constructor.getPricePartnerIndex(
      partnerId,
      flavorId,
      type,
    );
    return get(prices, priceIndex, {
      price: { value: 0 },
      priceInUcents: 0,
      tax: 0,
    });
  }

  formatPriceForHour(prices, flavorId) {
    return this.PriceFormatter.format(this.getPriceForHour(prices, flavorId));
  }

  computeTotalPrice(prices, flavorId, nb) {
    return flavorId
      ? this.PriceFormatter.format(this.getPriceForHour(prices, flavorId) * nb)
      : '';
  }
}
