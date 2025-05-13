import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyServiceVoicemailManagementCtrl(
  $scope,
  $stateParams,
  $q,
  $translate,
  $timeout,
  $filter,
  $document,
  $window,
  TucToastError,
  OvhApiTelephony,
) {
  const self = this;

  function fetchMessageList() {
    return OvhApiTelephony.Voicemail()
      .Directories()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.Voicemail()
                  .Directories()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    id: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => {
            const result = map(flatten(chunkResult), 'value');
            return map(result, (message) => {
              set(message, 'durationAsDate', new Date(message.duration * 1000));
              set(message, 'isPlaying', false);
              return message;
            });
          }),
      );
  }

  function init() {
    self.messages = {
      raw: null,
      sorted: null,
      paginated: null,
      selected: null,
      orderBy: 'creationDatetime',
      orderDesc: false,
      playing: null,
      isLoading: false,
      isDeleting: false,
    };

    const audioElement = $document.find('#voicemailAudio')[0];
    audioElement.addEventListener('ended', () => {
      $timeout(() => {
        self.messages.playing = null;
      });
    });

    self.messages.isLoading = true;
    fetchMessageList()
      .then((messages) => {
        self.messages.raw = angular.copy(messages);
        self.sortMessages();
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.messages.isLoading = false;
      });
  }

  this.getSelection = function getSelection() {
    return filter(
      self.messages.raw,
      (message) =>
        message && self.messages.selected && self.messages.selected[message.id],
    );
  };

  this.sortMessages = function sortMessages() {
    self.messages.sorted = $filter('orderBy')(
      self.messages.raw,
      self.messages.orderBy,
      self.messages.orderDesc,
    );
  };

  this.fetchMessageFile = function fetchMessageFile(message) {
    /**
     * Fetching a file is a little bit tricky because if file state
     * is not "done" the url will redirect to a 404...
     * So we have to poll the query until the file state is "done"
     * or until the call fails.
     */
    const tryDownload = function tryDownload() {
      return OvhApiTelephony.Voicemail()
        .Directories()
        .v6()
        .download({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          id: message.id,
        })
        .$promise.then((info) => {
          if (info.status === 'error') {
            return $q.reject({
              statusText: 'Unable to download message',
            });
          }
          if (info.status === 'done') {
            return $q.when(info);
          }

          // file is not ready to download, just retry
          return $timeout(() => {
            OvhApiTelephony.Voicemail()
              .Directories()
              .v6()
              .resetCache();
            OvhApiTelephony.Voicemail()
              .Directories()
              .v6()
              .resetQueryCache();
            return tryDownload();
          }, 1000);
        });
    };
    return tryDownload();
  };

  this.listenMessage = function listenMessage(message) {
    if (self.messages.playing === message) {
      self.messages.playing = null;
      const audioElement = $document.find('#voicemailAudio')[0];
      audioElement.pause();
    } else {
      if (self.messages.playing) {
        self.messages.playing.pendingListen = false;
      }
      set(message, 'pendingListen', true);
      return self
        .fetchMessageFile(message)
        .then((info) => {
          const audioElt = $document.find('#voicemailAudio')[0];
          self.messages.playing = message;
          audioElt.src = info.url;
          audioElt.load();
          audioElt.play();
        })
        .catch((err) => new TucToastError(err))
        .finally(() => {
          set(message, 'pendingListen', false);
        });
    }
    return $q.when(null);
  };

  this.downloadMessage = function downloadMessage(message) {
    set(message, 'pendingDownload', true);
    return self
      .fetchMessageFile(message)
      .then((info) => {
        // eslint-disable-next-line no-param-reassign
        $window.location.href = info.url;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        set(message, 'pendingDownload', false);
      });
  };

  this.deleteMessages = function deleteMessages(messageList) {
    const queries = messageList.map(
      (message) =>
        OvhApiTelephony.Voicemail()
          .Directories()
          .v6()
          .delete({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: message.id,
          }).$promise,
    );
    self.messages.isDeleting = true;
    queries.push($timeout(angular.noop, 1000)); // avoid clipping
    return $q
      .all(queries)
      .then(() =>
        fetchMessageList().then((messages) => {
          self.messages.raw = angular.copy(messages);
          self.sortMessages();
        }),
      )
      .catch((err) => {
        // eslint-disable-next-line no-new
        new TucToastError(err);
        return $q.reject(err);
      })
      .finally(() => {
        self.messages.isDeleting = false;
      });
  };

  this.deleteMessage = function deleteMessage(message) {
    set(message, 'isDeleting', true);
    return self.deleteMessages([message]).then(() => {
      set(message, 'isDeleting', false);
    });
  };

  this.deleteSelectedMessages = function deleteSelectedMessages() {
    return self.deleteMessages(self.getSelection());
  };

  this.refresh = function refresh() {
    self.messages.isLoading = true;
    OvhApiTelephony.Voicemail()
      .Directories()
      .v6()
      .resetCache();
    OvhApiTelephony.Voicemail()
      .Directories()
      .v6()
      .resetQueryCache();
    return $q
      .all({
        noop: $timeout(angular.noop, 1000), // avoid clipping
        messages: fetchMessageList(),
      })
      .then((result) => {
        self.messages.raw = angular.copy(result.messages);
        self.sortMessages();
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.messages.isLoading = false;
      });
  };

  this.orderBy = function orderBy(by) {
    if (self.messages.orderBy === by) {
      self.messages.orderDesc = !self.messages.orderDesc;
    } else {
      self.messages.orderBy = by;
    }
    self.sortMessages();
  };

  init();
}
