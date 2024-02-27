import get from 'lodash/get';
import App from './App.class';
import { APP_PARTNER_PRESET_LICENSING } from './app.constants';

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

  getApps(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/app`,
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

  stopApp(serviceName, appId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/stop`)
      .then(({ data }) => data);
  }

  startApp(serviceName, appId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/start`)
      .then(({ data }) => data);
  }

  deleteApp(serviceName, appId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/ai/app/${appId}`)
      .then(({ data }) => data);
  }

  updateAppImage(serviceName, appId, imageurl) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/image`, {
        url: imageurl,
      })
      .then(({ data }) => data);
  }

  updateAppHttpPort(serviceName, appId, httpPort) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}`, {
        defaultHttpPort: httpPort,
      })
      .then(({ data }) => data);
  }

  getAppCommand(serviceName, appSpec) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app/command`, appSpec)
      .then(({ data }) => data.command);
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

  getPreset(serviceName, region, presetId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/preset/${presetId}`,
      )
      .then(({ data }) => data);
  }

  getPresets(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/preset`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getPartnersImages(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/app/image`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getPartners(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/partners/region/${region}/partner`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getPartner(serviceName, region, partnerId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/partners/region/${region}/partner/${partnerId}`,
      )
      .then(({ data }) => data);
  }

  upadatePartnerSignature(serviceName, region, partnerId) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/ai/partners/region/${region}/partner/${partnerId}/contract/signature`,
      )
      .then(({ data }) => data);
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

  updateScalingStrategy(serviceName, appId, strategy) {
    return this.$http
      .put(
        `/cloud/project/${serviceName}/ai/app/${appId}/scalingstrategy`,
        strategy,
      )
      .then(({ data }) => data);
  }

  static getPriceIndex(flavorId) {
    return `ai-app.${flavorId}.minute.consumption`;
  }

  static getPricePartnerIndex(partnerId, flavorId, licensing, type) {
    if (licensing === APP_PARTNER_PRESET_LICENSING.PER_SECOND_BRACKET) {
      return `ai-${partnerId}.${flavorId}-${type}-bracket1.unit.consumption`;
    }
    return `ai-app.${partnerId}-${flavorId}-${type}.minute.consumption`;
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

  getPartnerPrice(prices, partnerId, flavorId, licensing, type) {
    const priceIndex = this.constructor.getPricePartnerIndex(
      partnerId,
      flavorId,
      licensing,
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

  dataSync(serviceName, appId, dataSync) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app/${appId}/datasync`, dataSync)
      .then(({ data }) => data);
  }
}
