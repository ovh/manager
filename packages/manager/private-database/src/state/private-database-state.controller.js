import filesize from 'filesize';
import _ from 'lodash';

export default class PrivateDatabaseStateCtrl {
  constructor(
    $q,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    WucConverterService,
    OvhHttp,
    Navigator,
    OomService,
    PrivateDatabase,
    SessionService,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.WucConverterService = WucConverterService;
    this.ovhHttp = OvhHttp;
    this.navigatorService = Navigator;
    this.oomService = OomService;
    this.privateDatabaseService = PrivateDatabase;
    this.sessionService = SessionService;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.database = this.$scope.database;
    this.isExpired = _.get(this.database, 'serviceInfos.status') === 'expired';
    this.displayMore = {
      value: false,
    };

    this.hostingsLinked = [];
    this.userInfos = {};

    this.database.oom = {
      nbOomError: 4,
    };

    if (!this.isExpired) {
      this.getHostingsLinked();
      this.getOomList();
    }
  }

  convertBytesSize(nb, unit, decimalWanted = 0) {
    const res = filesize(this.WucConverterService.convertToOctet(nb, unit), {
      output: 'object',
      round: decimalWanted,
      base: -1,
    });
    const resUnit = this.$translate.instant(`unit_size_${res.symbol}`);

    return `${res.value} ${resUnit}`;
  }

  getOomList() {
    return this.oomService
      .getOomList(this.productId)
      .then((oomList) => {
        this.database.oom.list = oomList;
        this.database.oom.realList = [];
        return oomList;
      })
      .then(() => this.getRealList());
  }

  getRealList() {
    const exponent = {
      KB: 1,
      MB: 2,
      GB: 3,
    };
    this.database.oom.realList = _.filter(
      this.database.oom.list,
      item => filesize(item.sizeReached, { output: 'object', exponent: _.get(exponent, this.database.ram.unit, -1) }).value > this.database.ram.value,
    );
    return this.database.oom.realList;
  }

  getHostingsLinked() {
    this.privateDatabaseService
      .getHostingsLinked(this.productId)
      .then(hostingsLinkedsId => this.$q.all(_.map(
        hostingsLinkedsId,
        mutuName => this.isAdminMutu(mutuName)
          .then(isAdmin => ({
            name: mutuName,
            isAdmin,
          })),
      )))
      .then((hostingsLinked) => {
        this.hostingsLinked = hostingsLinked;
      })
      .catch(err => this.alerter.error(err));
  }

  getUserInfos() {
    this.sessionService
      .getUser()
      .then((user) => {
        this.userInfos = user;
      })
      .catch(err => this.$q.reject(err));
  }

  isAdminMutu(mutu) {
    this.getUserInfos()
      .then(() => this.ovhHttp.get(`/hosting/web/${mutu}/serviceInfos`, { rootPath: 'apiv6' }))
      .then(mutuInfo => _.some(
        [
          mutuInfo.contactBilling,
          mutuInfo.contactTech,
          mutuInfo.contactAdmin,
        ],
        contactName => this.userInfos.nichandle === contactName,
      ))
      .catch((err) => {
        this.alerter.error(err);
        return false;
      });
  }

  goToHosting(hostingName) {
    this.$rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
      name: hostingName,
      type: 'HOSTING',
    });
    this.navigatorService.navigate(`configuration/hosting/${hostingName}`);
  }

  changeRootPassword() {
    this.$scope.taskState.changeRootPassword = true;
    this.$scope.setAction(
      'user/update/password/root/private-database-user-update-password-root',
      {
        database: this.$scope.database,
        passwordType: 'root',
      },
    );
  }

  changeFtpPassword() {
    this.$scope.taskState.changeFtpPassword = true;
    this.$scope.setAction(
      'user/update/password/root/private-database-user-update-password-root',
      {
        database: this.$scope.database,
        passwordType: 'ftp',
      },
    );
  }

  goToOom() {
    this.$scope.setAction('oom/private-database-oom', {
      database: this.$scope.database,
    });
  }
}
