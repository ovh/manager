import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import map from 'lodash/map';
import max from 'lodash/max';
import min from 'lodash/min';
import some from 'lodash/some';

export default class HostingSqlDatabaseOrderCtrl {
  /* @ngInject */
  constructor(
    $q, $scope, $stateParams, $timeout, $translate, $window,
    atInternet,
    WucConverterService, Hosting, HostingDatabase, HostingOptionOrder, PrivateDatabase, User,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;

    this.atInternet = atInternet;
    this.WucConverterService = WucConverterService;
    this.Hosting = Hosting;
    this.HostingDatabase = HostingDatabase;
    this.HostingOptionOrder = HostingOptionOrder;
    this.PrivateDatabase = PrivateDatabase;
    this.User = User;
  }

  $onInit() {
    this.hostingUrl = '#/configuration/hosting/';
    this.orderType = this.$stateParams.orderType;
    this.currentHosting = this.$stateParams.currentHosting;

    this.selectedHosting = null;
    this.includedOffer = false;

    this.$scope.alerts = {
      order: 'privatedatabase.alerts.order',
      durations: 'privatedatabase.alerts.order.duration',
    };

    this.loading = {
      init: false,
      durations: false,
      prices: false,
      bc: false,
      window: false,
    };

    this.data = [];
    this.model = {
      type: null,
      datacenter: null,
      version: null,
      ram: null,
      dbPack: null,
      hosting: null,
      duration: null,
      contract: false,
    };

    this.load();

    this.User.getUser().then((user) => {
      this.user = user;
    });

    console.log(this);
  }

  convertBytesSize(nb, unit = 'MB') {
    const res = filesize(this.WucConverterService.convertToOctet(nb, unit), { output: 'object', round: 0, base: -1 });
    const resUnit = this.$translate.instant(`unit_size_${res.symbol}`);

    return `${res.value} ${resUnit}`;
  }

  load() {
    const typeConverter = {
      dbaas: 'public',
      private: 'classic',
    };

    this.loading.init = true;

    return this.PrivateDatabase
      .getOrderModels()
      .then((models) => {
        const dbaasName = get(models, 'hosting.PrivateDatabase.OfferEnum').enum[1];
        const sqlName = get(models, 'hosting.PrivateDatabase.OfferEnum').enum[0];

        this.model.type = typeConverter[this.orderType] || sqlName;

        return this.$q
          .all({
            dbaasOrderCapacities: this.PrivateDatabase.getAvailableOrderCapacities(dbaasName),
            privateOrderCapacities: this.PrivateDatabase.getAvailableOrderCapacities(sqlName),
            domainNames: this.Hosting.getHostings(),
            dbPack: this.HostingOptionOrder.getOrderEnums('hosting.web.database.SqlPersoOfferEnum'),
          })
          .then((result) => {
            this.data = [
              {
                key: 'dbaas',
                offer: dbaasName,
                datacenters: result.dbaasOrderCapacities.datacenter,
                versions: result.dbaasOrderCapacities.version.sort(),
                rams: result.dbaasOrderCapacities.ram,
                dbPack: null,
                hostings: null,
                durations: null,
                tooltips: {
                  rams: {
                    min: this.convertBytesSize(min(result.dbaasOrderCapacities.ram)),
                    max: this.convertBytesSize(max(result.dbaasOrderCapacities.ram)),
                  },
                },
              },
              {
                key: 'premium',
                offer: sqlName,
                datacenters: result.privateOrderCapacities.datacenter,
                versions: result.privateOrderCapacities.version.sort(),
                rams: result.privateOrderCapacities.ram,
                dbPack: null,
                hostings: [],
                durations: null,
                tooltips: {
                  rams: {
                    min: this.convertBytesSize(min(result.privateOrderCapacities.ram)),
                    max: this.convertBytesSize(max(result.privateOrderCapacities.ram)),
                  },
                },
              },
              {
                key: 'start',
                offer: 'start',
                datacenters: null,
                versions: null,
                rams: null,
                dbPack: result.dbPack,
                hostings: [],
                durations: null,
              },
            ];
            return result;
          });
      })
      .then(({ domainNames }) => this.$q
        .all(map(domainNames, domainName => this.Hosting.getHosting(domainName)))
        .then(hostings => filter(hostings, { state: 'active' }))
        .then((hostings) => {
          this.noHostValue = 'other';

          find(this.data, { key: 'start' }).hostings = map(hostings, hosting => ({
            name: hosting.serviceName,
            displayName: punycode.toUnicode(hosting.serviceName),
            datacenter: hosting.datacenter,
            stillHasFreeDbOffer: false,
          }));
          find(this.data, { key: 'premium' }).hostings = angular.copy(find(this.data, { key: 'start' }).hostings);
          find(this.data, { key: 'premium' }).hostings.push({
            datacenter: null,
            displayName: this.$translate.instant('common_other'),
            name: this.noHostValue,
            stillHasFreeDbOffer: false,
          });

          this.model.hosting = this.currentHosting || null;

          if (this.model.hosting) {
            this.selectedHosting = this.findHosting(this.model.hosting);
            this.checkFreeDbOffer();
            this.model.datacenter = this.selectedHosting.datacenter || null;
          }
        }))
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step1_error'), err, this.$scope.alerts.durations))
      .finally(() => {
        this.loading.init = false;
      });
  }

  changeType() {
    this.model.datacenter = null;
    this.model.version = null;
    this.model.ram = null;
    this.model.dbPack = null;
    this.model.hosting = null;
    this.getDuration();
    this.resetOrder();
  }

  onHostingSelected() {
    if (!this.selectedHosting) {
      return;
    }

    this.setDatacenter();
    this.getDuration();
    this.checkFreeDbOffer();
  }

  checkFreeDbOffer() {
    if (this.selectedHosting.name !== this.noHostValue) {
      this.HostingDatabase.getPrivateDatabaseCapabilities(this.selectedHosting.name)
        .then((capabilities) => {
          this.selectedHosting.stillHasFreeDbOffer = some(capabilities);
        });
    }
  }

  shouldDisplayFreeDbWarning() {
    return this.isPrivateDb()
      && get(this.model, 'ram') === '512'
      && get(this.selectedHosting, 'stillHasFreeDbOffer');
  }

  /*
      * DURATION
      */
  getDuration() {
    this.loading.durations = true;
    this.model.duration = null;
    this.resetOrder();
    const selected = this.getData(this.model.type);

    return this[`getDurations${selected.key}`](selected).then((durations) => {
      this.loading.prices = true;
      return this[`getPrices${selected.key}`](selected, durations);
    });
  }

  getDurationspremium(data) {
    const { version, ram } = this.model;

    return this.PrivateDatabase
      .orderDuration(version, ram)
      .then((durations) => {
        data.durations = map(durations, duration => ({ // eslint-disable-line no-param-reassign
          duration,
          details: {},
        }));
        this.model.duration = last(durations);
        return durations;
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step2_duration_fail'), err, this.$scope.alerts.durations))
      .finally(() => {
        this.loading.durations = false;
      });
  }

  getDurationsdbaas(data) {
    const { version, ram } = this.model;

    return this.getDurationspremium(data, version, ram);
  }

  getDurationsstart(data) {
    const { hosting, dbPack: startDbVersion } = this.model;

    return this.HostingOptionOrder
      .getSqlPersoAllowedDurations(hosting, startDbVersion)
      .then((durations) => {
        data.durations = map(durations, duration => ({ // eslint-disable-line no-param-reassign
          duration,
          details: {},
        }));
        this.model.duration = last(durations);
        return durations;
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step2_duration_fail'), err, this.$scope.alerts.durations))
      .finally(() => {
        this.loading.durations = false;
      });
  }

  /*
      * PRICE
      */
  getPricespremium(data, durations) {
    const { version, ram } = this.model;

    return this.$q
      .all(map(
        durations,
        duration => this.PrivateDatabase
          .orderPrice(version, ram, duration)
          .then((details) => {
            find(data.durations, { duration }).details = details;
            return details;
          }),
      ))
      .then(() => {
        if (durations && durations.length === 1) {
          this.model.duration = head(durations);
        }
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step2_price_fail'), err, this.$scope.alerts.order))
      .finally(() => { this.loading.prices = false; });
  }

  getPricesdbaas(data, durations) {
    return this.getPricespremium(data, durations);
  }

  getPricesstart(data, durations) {
    const { hosting, dbPack: startDbVersion } = this.model;

    return this.$q
      .all(map(durations, duration => this.HostingOptionOrder
        .getSqlPersoPrice(hosting, startDbVersion, duration)
        .then((details) => {
          find(data.durations, { duration }).details = details;
          return details;
        })))
      .then(() => {
        if (durations && durations.length === 1) {
          this.model.duration = head(durations);
        }
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step2_price_fail'), err, this.$scope.alerts.order))
      .finally(() => { this.loading.prices = false; });
  }

  /*
      * BC
      */
  generateBc() {
    if (!this.model.contract) {
      return null;
    }
    this.loading.window = true;
    return this[`generateBc${this.getData(this.model.type).key}`]();
  }

  generateBcpremium() {
    this.loading.bc = true;

    return this.PrivateDatabase
      .orderPrivateDatabase(
        this.model.version,
        this.model.ram,
        this.model.duration,
        this.model.datacenter,
      )
      .then((details) => {
        this.order = details;
        this.$timeout(() => {
          this.loading.window = false;
          this.openBc();
        }, 5000);
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step3_fail'), err, this.$scope.alerts.order))
      .finally(() => {
        this.loading.bc = false;
      });
  }

  generateBcdbaas() {
    this.loading.bc = true;

    return this.PrivateDatabase
      .orderDBaaS(this.model.version, this.model.ram, this.model.duration, this.model.datacenter)
      .then((details) => {
        this.order = details;
        this.$timeout(() => {
          this.loading.window = false;
          this.openBc();
        }, 5000);
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step3_fail'), err, this.$scope.alerts.order))
      .finally(() => { this.loading.bc = false; });
  }

  generateBcstart() {
    this.loading.bc = true;

    return this.HostingOptionOrder
      .orderSqlPerso(this.model.hosting, this.model.dbPack, this.model.duration)
      .then((details) => {
        this.order = details;
        this.$timeout(() => {
          this.loading.window = false;
          this.openBc();
        }, 5000);
      })
      .catch(err => this.alerter.alertFromSWS(this.$translate.instant('privateDatabase_order_step3_fail'), err, this.$scope.alerts.order))
      .finally(() => { this.loading.bc = false; });
  }

  /*
      * ORDER
      */
  canOrder() {
    return !this.loading.bc && !this.loading.window;
  }

  canOrderpremium() {
    return this.model.contract
      && this.model.duration
      && this.model.ram
      && this.model.hosting
      && this.model.datacenter
      && this.model.version;
  }

  canOrderdbaas() {
    return this.model.contract
      && this.model.duration
      && this.model.ram
      && this.model.datacenter
      && this.model.version;
  }

  canOrderstart() {
    return this.model.contract
      && this.model.duration
      && this.model.hosting
      && this.model.datacenter
      && this.model.dbPack;
  }

  /*
      * UTILS
      */
  getData(type) {
    return find(this.data, { offer: type });
  }

  getDurationDetails(type, duration) {
    if (!duration) {
      return null;
    }
    return find(this.getData(type).durations, { duration }).details;
  }

  setDatacenter() {
    if (isEmpty(this.selectedHosting) || this.selectedHosting === this.noHostValue) {
      return;
    }
    this.model.hosting = this.selectedHosting.name;
    this.model.datacenter = this.selectedHosting.datacenter || null;
  }

  openBc() {
    this.atInternet.trackOrder({
      name: `[sql-${this.model.type}]::${this.model.version || this.model.dbPack}[${this.model.version || this.model.dbPack}]`,
      page: 'web::payment-pending',
      orderId: this.order.orderId,
      priceTaxFree: this.order.prices.withoutTax.value,
      price: this.order.prices.withTax.value,
      status: 1,
    });
    this.$window.open(this.order.url);
  }

  findHosting(name) {
    return find(this.getData(this.model.type).hostings, { name });
  }

  isCloudDbOrPrivateDb() {
    return this.isCloudDb() || this.isPrivateDb();
  }

  isCloudDb() {
    return this.getData(this.model.type).key === 'dbaas';
  }

  isPrivateDb() {
    return this.getData(this.model.type).key === 'premium';
  }

  isStart() {
    return this.getData(this.model.type).key === 'start';
  }

  resetOrder() {
    this.order = null;
  }

  makeHostingUrl(serviceName) {
    return this.hostingUrl + serviceName;
  }

  getNormalizedRAMSize(ramSize) {
    return ramSize < 1024
      ? ramSize + this.$translate.instant('unit_size_MB')
      : ramSize / 1024 + this.$translate.instant('unit_size_GB');
  }
}
