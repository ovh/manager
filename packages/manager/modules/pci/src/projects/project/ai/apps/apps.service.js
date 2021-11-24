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

  getApps() {
    const defer = this.$q.defer();
    defer.resolve([
      {
        id: 'c56b0cd3-e97d-4add-9283-93e99fb0f0f8',
        createdAt: '2021-11-19T09:46:47.745348Z',
        updatedAt: '2021-11-19T09:46:52.658246Z',
        user: 'user-MGTy7Tydaqa6',
        spec: {
          image:
            'priv-registry.gra.training.ai.cloud.ovh.net/public/infrastructureascode/hello-world:latest',
          command: [],
          env: [],
          region: 'GRA',
          defaultHttpPort: 8080,
          unsecureHttp: false,
          resources: {
            gpu: 1,
            cpu: 13,
            memory: 42949672960,
            publicNetwork: 1500000000,
            privateNetwork: 0,
            ephemeralStorage: 805306368000,
            gpuModel: 'Tesla-V100S',
            gpuBrand: 'NVIDIA',
            gpuMemory: 34359738368,
            flavor: 'ai1-1-gpu',
          },
          volumes: [
            {
              privateSwift: {
                container: 'test',
                region: 'WAW',
                prefix: '',
              },
              mountPath: '/mount_data',
              permission: 'RO',
              cache: false,
            },
          ],
          name: 'hello-world-unruffled',
          labels: {},
          scalingStrategy: {
            fixed: {
              replicas: 1,
            },
          },
        },
        status: {
          state: 'SCALING',
          availableReplicas: 0,
          url:
            'http://c56b0cd3-e97d-4add-9283-93e99fb0f0f8.app.cds-apps.console.dev.training.ai.cloud.ovh.net',
          infoUrl:
            'http://ui.cds-apps.console.dev.training.ai.cloud.ovh.net/app/c56b0cd3-e97d-4add-9283-93e99fb0f0f8',
          monitoringUrl:
            'http://monitoring.cds-apps.console.dev.training.ai.cloud.ovh.net/d/gpu?var-app=c56b0cd3-e97d-4add-9283-93e99fb0f0f8&from=1637315147745',
          history: [
            {
              state: 'QUEUED',
              date: '2021-11-19T09:46:47.745194Z',
            },
            {
              state: 'INITIALIZING',
              date: '2021-11-19T09:46:47.827671Z',
            },
            {
              state: 'SCALING',
              date: '2021-11-19T09:46:52.656937Z',
            },
          ],
        },
      },
    ]);

    return defer.promise;

    // return this.$http
    //   .get(
    //     `/cloud/project/${serviceName}/ai/notebook`,
    //     AppService.getIcebergHeaders(),
    //   )
    //   .then(({ data }) => data);
  }

  getApp() {
    const defer = this.$q.defer();
    defer.resolve({
      id: 'c56b0cd3-e97d-4add-9283-93e99fb0f0f8',
      createdAt: '2021-11-19T09:46:47.745348Z',
      updatedAt: '2021-11-19T09:46:52.658246Z',
      user: 'user-MGTy7Tydaqa6',
      spec: {
        image:
          'priv-registry.gra.training.ai.cloud.ovh.net/public/infrastructureascode/hello-world:latest',
        command: [],
        env: [],
        region: 'GRA',
        defaultHttpPort: 8080,
        unsecureHttp: false,
        resources: {
          gpu: 1,
          cpu: 13,
          memory: 42949672960,
          publicNetwork: 1500000000,
          privateNetwork: 0,
          ephemeralStorage: 805306368000,
          gpuModel: 'Tesla-V100S',
          gpuBrand: 'NVIDIA',
          gpuMemory: 34359738368,
          flavor: 'ai1-1-gpu',
        },
        volumes: [
          {
            privateSwift: {
              container: 'test',
              region: 'WAW',
              prefix: '',
            },
            mountPath: '/mount_data',
            permission: 'RO',
            cache: false,
          },
        ],
        name: 'hello-world-unruffled',
        labels: {},
        scalingStrategy: {
          fixed: {
            replicas: 1,
          },
        },
      },
      status: {
        state: 'SCALING',
        availableReplicas: 0,
        url:
          'http://c56b0cd3-e97d-4add-9283-93e99fb0f0f8.app.cds-apps.console.dev.training.ai.cloud.ovh.net',
        infoUrl:
          'http://ui.cds-apps.console.dev.training.ai.cloud.ovh.net/app/c56b0cd3-e97d-4add-9283-93e99fb0f0f8',
        monitoringUrl:
          'http://monitoring.cds-apps.console.dev.training.ai.cloud.ovh.net/d/gpu?var-app=c56b0cd3-e97d-4add-9283-93e99fb0f0f8&from=1637315147745',
        history: [
          {
            state: 'QUEUED',
            date: '2021-11-19T09:46:47.745194Z',
          },
          {
            state: 'INITIALIZING',
            date: '2021-11-19T09:46:47.827671Z',
          },
          {
            state: 'SCALING',
            date: '2021-11-19T09:46:52.656937Z',
          },
        ],
      },
    });

    return defer.promise;

    // return this.$http
    //   .get(
    //     `/cloud/project/${serviceName}/ai/notebook`,
    //     AppService.getIcebergHeaders(),
    //   )
    //   .then(({ data }) => data);
    // return this.$http
    //   .get(AppService.buildGetAppUrl(serviceName, appId))
    //   .then(({ data }) => data);
  }

  addApp(serviceName, app) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app`, app)
      .then(({ data }) => data);
  }

  removeApp(serviceName, appId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/ai/app/${appId}`)
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
        description: [
          'Powered by Hugging Face Infinity',
          'A French sentiment analysis model, based on CamemBERT, and finetuned on a large-scale dataset scraped from Allociné.fr user reviews.',
        ],
        name: 'French Sentiment Analysis',
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
        docUrl: [
          {
            name: 'Model URL',
            link: 'https://huggingface.co/philschmid/pt-tblard-tf-allocine',
          },
          {
            name: 'Documentation URL',
            link: 'https://huggingface.co/infinity',
          },
        ],
        logoUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_811aaa421cdf4cf1b3507d4d2143f461/logo/huggingface.svg',
      },
      {
        id: 'huggingface/translate-fr-en-infinity',
        description: [
          'Powered by Hugging Face Infinity',
          'A English sentiment analysis model, based on MiniLM, and finetuned on the Stanford Sentiment Treebank v2 (sst2) dataset',
        ],
        name: 'English Sentiment Analysis',
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
        docUrl: [
          {
            name: 'Model URL',
            url:
              'https://huggingface.co/philschmid/MiniLM-L6-H384-uncased-sst2',
          },
          {
            name: 'Documentation URL',
            url: 'https://huggingface.co/infinity',
          },
        ],
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
