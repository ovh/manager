import angular from 'angular';
import set from 'lodash/set';
import 'moment';

export default class OverTheBoxRemoteCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $scope,
    $q,
    CORE_URLS,
    OVER_THE_BOX,
    OVERTHEBOX_REMOTE_STATUS,
    OvhApiOverTheBox,
    TucIpAddress,
    TucToast,
    TucToastError,
    tucValidator,
  ) {
    this.$translate = $translate;
    this.$scope = $scope;
    this.$q = $q;
    this.CORE_URLS = CORE_URLS;
    this.OVER_THE_BOX = OVER_THE_BOX;
    this.remoteStatus = OVERTHEBOX_REMOTE_STATUS;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucIpAddress = TucIpAddress;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.validator = tucValidator;
  }

  $onInit() {
    this.filter = {
      perPage: 10,
    };

    this.publicKeyHelperUrl = this.CORE_URLS.keyGenHelp;
    this.pickerOpened = false;
    this.maxRemotes = this.OVER_THE_BOX.maxRemotes;

    this.init();
  }

  /**
   * Initialize the controller
   */
  init() {
    this.paginatedRemotes = [];
    this.remotes = [];
    this.newRemote = {
      exposedPort: 443,
    };
    this.datepickerOptions = {
      minDate: moment()
        .add(1, 'days')
        .toDate(),
    };
    this.loading = true;
    return this.$q.all([
      /* Load all remotes */
      this.OvhApiOverTheBox.Aapi()
        .remoteAccesses(
          {
            serviceName: this.serviceName,
          },
          null,
        )
        .$promise.then((remotes) => {
          this.remotes = remotes;
        })
        .catch((err) => {
          this.remotes = [];
          return new this.TucToastError(err);
        })
        .finally(() => {
          this.loading = false;
        }),

      /* Create tho poller */
      this.OvhApiOverTheBox.Aapi()
        .poll(this.$scope, {
          serviceName: this.serviceName,
        })
        .then(
          (remotes) => {
            this.remotes = remotes;
          },
          () => {
            this.remotes = [];
          },
          (remotes) => {
            this.remotes = remotes;
          },
        ),
    ]);
  }

  /**
   * Update remote data
   * @param newRemote
   * @param oldRemote
   */
  updateRemote(newRemote, oldRemote) {
    this.remotes = this.remotes.map((remote) =>
      remote.remoteAccessId === oldRemote.remoteAccessId ? newRemote : remote,
    );
    this.paginatedRemotes = this.paginatedRemotes.map((remote) =>
      remote.remoteAccessId === oldRemote.remoteAccessId ? newRemote : remote,
    );
  }

  isIpValid(ip) {
    if (!ip) {
      return true;
    }
    return this.TucIpAddress.isValidIp(ip);
  }

  openDatePicker(event) {
    this.pickerOpened = true;
    event.stopPropagation();
  }

  /**
   * Create a new remote
   */
  addRemote() {
    this.adding = true;
    const formData = angular.copy(this.newRemote);
    if (this.newRemote.expirationDate) {
      formData.expirationDate = moment(
        this.newRemote.expirationDate,
      ).toISOString();
    }
    return this.OvhApiOverTheBox.Aapi()
      .createAndAuthorize(
        {
          serviceName: this.serviceName,
        },
        formData,
      )
      .$promise.then(() => {
        this.init();
        this.addForm = false;
        this.TucToast.success(
          this.$translate.instant('overTheBox_remote_element_added'),
        );
      })
      .catch((err) => {
        if (
          err &&
          err.data ===
            "Impossible to create a remote access, your device hasn't contacted us for more than 10 minutes"
        ) {
          this.TucToast.error(
            this.$translate.instant('overTheBox_remote_error_no_contact'),
          );
        } else {
          this.TucToast.error(
            this.$translate.instant('overTheBox_remote_error_unknown'),
          );
        }
        return this.$q.reject(err);
      })
      .finally(() => {
        this.adding = false;
      });
  }

  /**
   * Validate that the date is in the future
   * @param {Date} when Date to compare
   * @return {Boolean}
   */
  static isInFuture(when) {
    return !when || moment(when).isAfter(new Date());
  }

  /**
   * Connection information to display
   * @param remote
   * @returns {string}
   */
  static getSshConnectionHelp(remote) {
    return remote && remote.connectionInfos && remote.connectionInfos.ip
      ? `ssh -p ${remote.connectionInfos.port} root@${remote.connectionInfos.ip}`
      : '';
  }

  /**
   * Connection information to display
   * @param remote
   * @returns {string}
   */
  static getHttpConnectionHelp(remote) {
    return remote && remote.connectionInfos && remote.connectionInfos.port
      ? `https://${remote.connectionInfos.ip}:${remote.connectionInfos.port}/`
      : '';
  }

  /**
   * Authorize a remote (used when support created a remote)
   * @param remote
   */
  authorize(remote) {
    set(remote, 'busy', true);
    return this.OvhApiOverTheBox.v6()
      .authorizeRemote(
        {
          serviceName: this.serviceName,
          remoteAccessId: remote.remoteAccessId,
        },
        null,
      )
      .$promise.then(() => this.reloadRemote(remote))
      .catch((err) => {
        set(remote, 'busy', false);
        return new this.TucToastError(err);
      });
  }

  /**
   * Reload one remote
   * @param remote
   * @returns {*}
   */
  reloadRemote(remote) {
    set(remote, 'busy', true);
    return this.OvhApiOverTheBox.v6()
      .loadRemote(
        {
          serviceName: this.serviceName,
          remoteAccessId: remote.remoteAccessId,
        },
        null,
      )
      .$promise.then((reloaded) => {
        this.updateRemote(reloaded, remote);
        if (reloaded.accepted) {
          if (reloaded.status !== 'toDelete') {
            this.TucToast.success(
              this.$translate.instant('overTheBox_remote_authorized', {
                port: reloaded.exposedPort,
              }),
            );
          }
        } else {
          this.TucToast.error(
            this.$translate.instant('overTheBox_remote_authorized_failed', {
              port: reloaded.exposedPort,
            }),
          );
        }
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        set(remote, 'busy', false);
      });
  }

  /**
   * Delete a remote
   * @param remote
   */
  remove(remote) {
    set(remote, 'busy', true);
    return this.OvhApiOverTheBox.v6()
      .deleteRemote(
        {
          serviceName: this.serviceName,
          remoteAccessId: remote.remoteAccessId,
        },
        null,
      )
      .$promise.then(() => {
        this.TucToast.success(
          this.$translate.instant('overTheBox_remote_element_deleted'),
        );
        this.reloadRemote(remote);
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        set(remote, 'busy', false);
      });
  }
}
