import filesize from 'filesize';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

import {
  PRIVATE_DATABASE_GUIDES,
  PRIVATE_DATABASE_DBAAS_GUIDES,
} from './constants';

export default class PrivateDatabaseStateCtrl {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    WucConverterService,
    Navigator,
    PrivateDatabaseOomService,
    PrivateDatabase,
    userLink,
    WucUser,
    coreConfig,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.WucConverterService = WucConverterService;
    this.navigatorService = Navigator;
    this.oomService = PrivateDatabaseOomService;
    this.privateDatabaseService = PrivateDatabase;
    this.canOrderRam = false;
    this.userLink = userLink;
    this.userService = WucUser;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.database = this.$scope.database;
    this.isExpired = get(this.database, 'serviceInfos.status') === 'expired';
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

    this.privateDatabaseService.canOrderRam(this.productId).then((canOrder) => {
      this.canOrderRam = canOrder;
    });

    // this.coreConfig.getUser().ovhSubsidiary;
    this.guides = [];

    let subGuides;

    if (this.$scope.database) {
      if (this.$scope.database.offer === 'classic') {
        subGuides =
          PRIVATE_DATABASE_GUIDES[this.coreConfig.getUser().ovhSubsidiary];
      } else if (this.$scope.database.offer === 'public') {
        subGuides =
          PRIVATE_DATABASE_DBAAS_GUIDES[
            this.coreConfig.getUser().ovhSubsidiary
          ];
      }

      if (subGuides) {
        this.guides = Object.keys(subGuides).reduce((acc, key) => {
          return [...acc, { url: subGuides[key], title: key }];
        }, []);
      }
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
    this.database.oom.realList = filter(
      this.database.oom.list,
      (item) =>
        filesize(item.sizeReached, {
          output: 'object',
          exponent: get(exponent, this.database.ram.unit, -1),
        }).value > this.database.ram.value,
    );
    return this.database.oom.realList;
  }

  getHostingsLinked() {
    this.privateDatabaseService
      .getHostingsLinked(this.productId)
      .then((hostingsLinkedsId) =>
        this.$q.all(
          map(hostingsLinkedsId, (mutuName) =>
            this.isAdminMutu(mutuName).then((isAdmin) => ({
              name: mutuName,
              isAdmin,
            })),
          ),
        ),
      )
      .then((hostingsLinked) => {
        this.hostingsLinked = hostingsLinked;
      })
      .catch((err) => this.alerter.error(err));
  }

  getUserInfos() {
    this.userService
      .getUser()
      .then((user) => {
        this.userInfos = user;
      })
      .catch((err) => this.$q.reject(err));
  }

  isAdminMutu(mutu) {
    this.getUserInfos()
      .then(() => this.privateDatabaseService.getHostingServiceInfos(mutu))
      .then((mutuInfo) =>
        some(
          [
            mutuInfo.contactBilling,
            mutuInfo.contactTech,
            mutuInfo.contactAdmin,
          ],
          (contactName) => this.userInfos.nichandle === contactName,
        ),
      )
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

  refreshQuota() {
    this.privateDatabaseService
      .refreshQuota(this.$stateParams.productId)
      .then((task) => {
        this.alerter.success(
          this.$translate.instant('privateDatabase_quota_refresh_success'),
          this.$scope.alerts.main,
        );
        this.$scope.pollAction(task);
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_quota_refresh_fail'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }
}
