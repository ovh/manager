import endsWith from 'lodash/endsWith';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

export default /* @ngInject */ function TelecomTelephonyAliasHuntingSoundsCtrl(
  $stateParams,
  $uibModalInstance,
  $timeout,
  $q,
  $translate,
  params,
  OvhApiMe,
  TucToastError,
  tucVoipServiceTask,
) {
  const self = this;

  function init() {
    self.sounds = params.sounds;
    self.apiEndpoint = params.apiEndpoint;
  }

  self.close = function close() {
    $uibModalInstance.dismiss();
  };

  self.checkValidAudioExtention = function checkValidAudioExtention(file) {
    const validExtensions = ['aiff', 'au', 'flac', 'ogg', 'mp3', 'wav', 'wma'];
    const fileName = file ? file.name : '';
    const found = some(validExtensions, (ext) => endsWith(fileName.toLowerCase(), ext));
    if (!found) {
      TucToastError($translate.instant('telephony_alias_hunting_sounds_invalid'));
    }
    return found;
  };

  self.uploadFile = function uploadFile() {
    // api does not handle space characters in filenames
    const name = (self.toUpload.name || '').replace(/\s/g, '_');
    self.isUploading = true;

    // first, upload document to get a file url
    return OvhApiMe.Document().v6().upload(
      name,
      self.toUpload,
    ).then((doc) => self.apiEndpoint.v6().soundUpload({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, {
      name,
      url: doc.getUrl,
    }).$promise.then((result) => tucVoipServiceTask.startPolling(
      $stateParams.billingAccount,
      $stateParams.serviceName,
      result.taskId,
      {
        namespace: `soundUploadTask_${$stateParams.serviceName}`,
        interval: 1000,
        retryMaxAttempts: 0,
      },
    ).catch((err) => {
      // When the task does not exist anymore it is considered done (T_T)
      if (err.status === 404) {
        // add some delay to ensure we get the sound from api when refreshing
        return $timeout(() => $q.when(true), 2000);
      }
      return $q.reject(err);
    })))
      .then(() => {
        self.toUpload = null;
        params.refreshSounds();
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isUploading = false;
      });
  };

  self.chooseSound = function chooseSound(sound) {
    $uibModalInstance.close(sound);
  };

  self.deleteSound = function deleteSound(sound) {
    set(sound, 'isDeleting', true);
    return $q.all([
      $timeout(angular.noop, 500),
      self.apiEndpoint.Sound().v6().remove({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        soundId: sound.soundId,
      }).$promise.then(() => {
        remove(self.sounds, { soundId: sound.soundId });
      }).catch((err) => new TucToastError(err)).finally(() => {
        set(sound, 'isDeleting', false);
      }),
    ]);
  };

  init();
}
