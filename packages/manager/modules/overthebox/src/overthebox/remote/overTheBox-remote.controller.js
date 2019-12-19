import angular from 'angular';
import moment from 'moment';
import set from 'lodash/set';

export default /* @ngInject */ function
($stateParams, $translate, $scope, $q, CORE_URLS, OVER_THE_BOX, OVERTHEBOX_REMOTE_STATUS,
  OvhApiOverTheBox, TucToastError, TucToast, TucIpAddress, tucValidator) {
  const self = this;

  this.filter = {
    perPage: 10,
  };

  this.remoteStatus = OVERTHEBOX_REMOTE_STATUS;

  this.validator = tucValidator;
  this.publicKeyHelperUrl = CORE_URLS.keyGenHelp;
  this.pickerOpened = false;
  this.maxRemotes = OVER_THE_BOX.maxRemotes;

  /**
   * Initialize the controller
   */
  function init() {
    self.paginatedRemotes = [];
    self.remotes = [];
    self.newRemote = {
      exposedPort: 443,
    };
    self.datepickerOptions = {
      minDate: moment().add(1, 'days').toDate(),
    };
    self.loading = true;
    return $q.all([
      /* Load all remotes */
      OvhApiOverTheBox.Aapi().remoteAccesses({
        serviceName: $stateParams.serviceName,
      }, null).$promise.then(
        (remotes) => {
          self.remotes = remotes;
        },
        (err) => {
          self.remotes = [];
          return new TucToastError(err);
        },
      ).finally(() => {
        self.loading = false;
      }),

      /* Create tho poller */
      OvhApiOverTheBox.Aapi().poll($scope, {
        serviceName: $stateParams.serviceName,
      }).then(
        (remotes) => {
          self.remotes = remotes;
        },
        TucToastError,
        (remotes) => {
          self.remotes = remotes;
        },
      ),
    ]);
  }

  /**
   * Update remote data
   * @param newRemote
   * @param oldRemote
   */
  function updateRemote(newRemote, oldRemote) {
    self.remotes = self.remotes
      .map((remote) => (remote.remoteAccessId === oldRemote.remoteAccessId ? newRemote : remote));
    self.paginatedRemotes = self.paginatedRemotes
      .map((remote) => (remote.remoteAccessId === oldRemote.remoteAccessId ? newRemote : remote));
  }

  this.isIpValid = function isIpValid(ip) {
    if (!ip) {
      return true;
    }
    return TucIpAddress.isValidIp(ip);
  };

  this.openDatePicker = function openDatePicker(event) {
    self.pickerOpened = true;
    event.stopPropagation();
  };

  /**
   * Create a new remote
   */
  this.addRemote = function addRemote() {
    self.adding = true;
    const formData = angular.copy(this.newRemote);
    if (this.newRemote.expirationDate) {
      formData.expirationDate = moment(this.newRemote.expirationDate).toISOString();
    }
    return OvhApiOverTheBox.Aapi().createAndAuthorize({
      serviceName: $stateParams.serviceName,
    }, formData).$promise.then(() => {
      init();
      self.addForm = false;
      TucToast.success($translate.instant('overTheBox_remote_element_added'));
    }).catch((err) => {
      if (err && err.data === "Impossible to create a remote access, your device hasn't contacted us for more than 10 minutes") {
        TucToast.error($translate.instant('overTheBox_remote_error_no_contact'));
      } else {
        TucToast.error($translate.instant('overTheBox_remote_error_unknown'));
      }
      return $q.reject(err);
    }).finally(() => {
      self.adding = false;
    });
  };

  /**
   * Validate that the date is in the future
   * @param {Date} when Date to compare
   * @return {Boolean}
   */
  this.isInFuture = function isInFuture(when) {
    return !when || moment(when).isAfter(new Date());
  };

  /**
   * Connection information to display
   * @param remote
   * @returns {string}
   */
  this.getSshConnectionHelp = function getSshConnectionHelp(remote) {
    return remote && remote.connectionInfos && remote.connectionInfos.ip
      ? `ssh -p ${remote.connectionInfos.port} root@${remote.connectionInfos.ip}`
      : '';
  };

  /**
   * Connection information to display
   * @param remote
   * @returns {string}
   */
  this.getHttpConnectionHelp = function getHttpConnectionHelp(remote) {
    return remote && remote.connectionInfos && remote.connectionInfos.port
      ? `https://${remote.connectionInfos.ip}:${remote.connectionInfos.port}/`
      : '';
  };

  /**
   * Authorize a remote (used when support created a remote)
   * @param remote
   */
  this.authorize = function authorize(remote) {
    set(remote, 'busy', true);
    return OvhApiOverTheBox.v6().authorizeRemote(
      {
        serviceName: $stateParams.serviceName,
        remoteAccessId: remote.remoteAccessId,
      },
      null,
    ).$promise.then(() => self.reloadRemote(remote), (err) => {
      set(remote, 'busy', false);
      return new TucToastError(err);
    });
  };

  /**
   * Reload one remote
   * @param remote
   * @returns {*}
   */
  this.reloadRemote = function reloadedRemote(remote) {
    set(remote, 'busy', true);
    return OvhApiOverTheBox.v6().loadRemote({
      serviceName: $stateParams.serviceName,
      remoteAccessId: remote.remoteAccessId,
    }, null).$promise.then((reloaded) => {
      updateRemote(reloaded, remote);
      if (reloaded.accepted) {
        if (reloaded.status !== 'toDelete') {
          TucToast.success($translate.instant('overTheBox_remote_authorized', { port: reloaded.exposedPort }));
        }
      } else {
        TucToast.error($translate.instant('overTheBox_remote_authorized_failed', { port: reloaded.exposedPort }));
      }
    }, TucToastError).finally(() => {
      set(remote, 'busy', false);
    });
  };

  /**
   * Delete a remote
   * @param remote
   */
  this.remove = function remove(remote) {
    set(remote, 'busy', true);
    return OvhApiOverTheBox.v6().deleteRemote({
      serviceName: $stateParams.serviceName,
      remoteAccessId: remote.remoteAccessId,
    }, null).$promise.then(() => {
      TucToast.success($translate.instant('overTheBox_remote_element_deleted'));
      self.reloadRemote(remote);
    }, TucToastError).finally(() => {
      set(remote, 'busy', false);
    });
  };

  init();
}
