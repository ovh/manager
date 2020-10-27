import endsWith from 'lodash/endsWith';
import last from 'lodash/last';
import some from 'lodash/some';

export default /* @ngInject */ function telephonyNumberOvhPabxSoundUploaderCtrl(
  $q,
  $translate,
  TucToast,
) {
  const self = this;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function getFileNameToWav(fileName) {
    const splittedFileName = fileName.split('.');
    const extension = last(splittedFileName);
    if (extension === 'wav') {
      return fileName;
    }

    // remove exension from file name
    splittedFileName.pop();

    // return new file name to wav format
    return `${splittedFileName.join('.').replace(/ /g, '_')}.wav`;
  }

  function validateFile() {
    // decode file extension
    const validExtensions = ['ogg', 'mp3', 'wav', 'wma'];
    const fileName = self.file ? self.file.name : '';
    const fileNameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf('.'),
    );
    const isValidFormat = some(validExtensions, (ext) =>
      endsWith(fileName.toLowerCase(), `.${ext}`),
    );
    const nameRegex = new RegExp(/^[\w\s]{1,26}$/, 'g');

    // check for errors
    if (!isValidFormat) {
      // check for format
      self.$errors.extension = true;
      return false;
    }
    if (!nameRegex.test(fileNameWithoutExtension)) {
      // check for file name
      self.$errors.name = true;
      return false;
    }
    if (self.file.size > 10000000) {
      // check for file size
      self.$errors.size = true;
      return false;
    }
    self.$errors.exists = some(self.ovhPabx.sounds, {
      name: getFileNameToWav(fileName),
    });
    return !self.$errors.exists;
  }

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onSoundFileChoosed = function onSoundFileChoosed(file) {
    // set model
    self.file = file;

    // reset errors
    self.$errors.extension = false;
    self.$errors.size = false;
    self.$errors.name = false;
    self.$errors.exists = false;

    // validate file
    if (!validateFile()) {
      return self.$errors;
    }

    // no errors add to sounds list
    const sound = self.ovhPabx.addSound({
      billingAccount: self.ovhPabx.billingAccount,
      serviceName: self.ovhPabx.serviceName,
      name: getFileNameToWav(self.file.name),
      status: 'IN_CREATION',
    });

    // start upload
    return sound
      .upload(self.file)
      .then(
        () => self.ovhPabx.getSounds(),
        (error) => {
          const errorMsg = $translate.instant(
            'telephony_number_feature_ovh_pabx_sound_upload_error',
            {
              file: sound.name,
            },
          );
          self.ovhPabx.removeSound(sound);
          TucToast.error(
            [
              errorMsg,
              error.message || (error.data && error.data.message) || '',
            ].join(' '),
          );
          return $q.reject(error);
        },
      )
      .finally(() => {
        self.file = null;
      });
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.$errors = {
      extension: false,
      size: false,
      name: false,
      exists: false,
    };
  };

  /* -----  End of INITIALIZATION  ------*/
}
