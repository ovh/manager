export default /* @ngInject */ (
  $q,
  $timeout,
  OvhApiMe,
  OvhApiTelephony,
  tucVoipServiceTask,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberOvhPabxSound(soundOptionsParam) {
    let soundOptions = soundOptionsParam;

    if (!soundOptions) {
      soundOptions = {};
    }

    // check for mandatory options
    if (!soundOptions.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabxSound',
      );
    }

    if (!soundOptions.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabxSound',
      );
    }

    // set mandatory attributes
    this.billingAccount = soundOptions.billingAccount;
    this.serviceName = soundOptions.serviceName;

    // other attributes
    this.soundId = soundOptions.soundId;
    this.name = null;
    this.status = null;

    this.setInfos(soundOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  TelephonyGroupNumberOvhPabxSound.prototype.setInfos = function setInfos(
    soundOptions,
  ) {
    const self = this;

    self.name = soundOptions.name || null;
    self.status = soundOptions.status || 'OK';

    return self;
  };

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroupNumberOvhPabxSound.prototype.remove = function remove() {
    const self = this;

    self.status = 'DELETING';

    return OvhApiTelephony.OvhPabx()
      .Sound()
      .v6()
      .remove({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        soundId: self.soundId,
      })
      .$promise.catch((error) => {
        self.status = 'OK';
        return $q.reject(error);
      });
  };

  TelephonyGroupNumberOvhPabxSound.prototype.upload = function upload(file) {
    const self = this;

    // first upload file to user document
    return OvhApiMe.Document()
      .v6()
      .upload(self.name, file)
      .then((doc) =>
        OvhApiTelephony.OvhPabx()
          .v6()
          .soundUpload(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
            },
            {
              name: self.name,
              url: doc.getUrl,
            },
          )
          .$promise.then((task) =>
            tucVoipServiceTask
              .startPolling(
                self.billingAccount,
                self.serviceName,
                task.taskId,
                {
                  namespace: `soundUploadTask_${self.serviceName}`,
                  interval: 1000,
                  retryMaxAttempts: 0,
                },
              )
              .catch((err) => {
                // When the task does not exist anymore it is considered done (T_T)
                if (err.status === 404) {
                  // add some delay to ensure we get the sound from api when refreshing
                  return $timeout(() => $q.when(true), 2000);
                }
                return $q.reject(err);
              })
              .finally(() => {
                // to finish delete file uploaded to user document
                // we don't care about success or fail
                OvhApiMe.Document()
                  .v6()
                  .delete({
                    id: doc.id,
                  });
              }),
          ),
      );
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberOvhPabxSound;
};
