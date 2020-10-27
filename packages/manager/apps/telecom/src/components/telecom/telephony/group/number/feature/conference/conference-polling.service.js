export default /* @ngInject */ function telephonyGroupNumberConferencePolling(
  $q,
  $timeout,
) {
  const self = this;
  let pollingDeferred = null;
  let pollingPromise = null;
  let pollingStarted = false;

  self.conference = null;

  /*= =========================================
    =            POLLING MANAGEMENT            =
    ========================================== */

  function poll() {
    if (!pollingStarted) {
      return;
    }

    pollingPromise = $timeout(() => self.conference.getInfos(), 1000).then(
      () => {
        pollingDeferred.notify();
        poll();
      },
      (error) => pollingDeferred.reject(error),
    );
  }

  self.startPolling = function startPolling() {
    pollingStarted = true;
    return poll();
  };

  self.stopPolling = function stopPolling() {
    pollingStarted = false;
    if (pollingPromise) {
      $timeout.cancel(pollingPromise);
    }
    pollingDeferred.reject();
  };

  self.pausePolling = function pausePolling() {
    pollingStarted = false;
    if (pollingPromise) {
      $timeout.cancel(pollingPromise);
    }
  };

  /* -----  End of POLLING MANAGEMENT  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
   *  Init and start conference polling
   */
  self.initPolling = function initPolling(conferenceObj) {
    // set conference instance to poll
    self.conference = conferenceObj;

    // set polling deferred
    pollingDeferred = $q.defer();

    // start polling
    self.startPolling();

    return pollingDeferred.promise;
  };

  /* -----  End of INITIALIZATION  ------*/
}
