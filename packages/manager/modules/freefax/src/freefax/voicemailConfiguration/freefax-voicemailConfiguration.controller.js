import find from 'lodash/find';

export default /* @ngInject */ function (
  $q,
  $stateParams,
  $translate,
  OvhApiFreeFax,
  TucToast,
  TucToastError,
  FREEFAX_AUDIO_FORMAT,
) {
  const self = this;
  let initialActivateVoiceMail;

  self.serviceName = $stateParams.serviceName;

  function init() {
    self.loading = true;
    self.editMode = false;

    self.audioFormatList = [];
    FREEFAX_AUDIO_FORMAT.forEach((audioFormat) => {
      self.audioFormatList.push({
        label: audioFormat,
        value: audioFormat,
      });
    });

    return OvhApiFreeFax.v6()
      .voiceMailGet({
        serviceName: $stateParams.serviceName,
      })
      .$promise.then(
        (voiceMail) => {
          self.voiceMail = voiceMail;
          self.voiceMailPassword = '';
          self.voiceMail.audioFormat = find(self.audioFormatList, {
            value: self.voiceMail.audioFormat,
          });
          return self.voiceMail;
        },
        (err) => new TucToastError(err),
      )
      .then(() =>
        OvhApiFreeFax.v6()
          .voiceMailGetRouting({
            serviceName: $stateParams.serviceName,
          })
          .$promise.then(
            (routing) => {
              initialActivateVoiceMail = routing.value;
              self.voiceMail.activateVoiceMail = routing.value === 'voicemail';
              return self.voiceMail;
            },
            (err) => {
              self.voiceMail.activateVoiceMail = false;
              return new TucToastError(err);
            },
          ),
      )
      .finally(() => {
        self.loading = false;
      });
  }

  this.cancelEditMode = function cancelEditMode() {
    self.voiceMail = JSON.parse(self.savedConf);
    self.voiceMail.audioFormat = find(self.audioFormatList, {
      value: self.voiceMail.audioFormat.value,
    });
    self.editMode = false;
  };

  this.enterEditMode = function enterEditMode() {
    self.password = ['', ''];
    self.savedConf = JSON.stringify(self.voiceMail);
    self.editMode = true;
  };

  this.saveConfiguration = function saveConfiguration(conf) {
    const tasks = [self.save(conf)];

    if (self.password[0]) {
      tasks.push(self.changePassword(self.password[0]));
    }

    $q.all(tasks).then(() => {
      TucToast.success($translate.instant('freefax_voicemail_success'));
      init();
    }, TucToastError);
  };

  this.validPassword = function validPassword(val) {
    return /^[0-9]{4}$/.test(val) || !val;
  };

  this.validName = function validName(val) {
    return (
      /^[\wàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅå\s\-_']*$/.test(
        val,
      ) || !val
    );
  };

  this.checkPassword = function checkPassword() {
    return (
      self.password[0] === self.password[1] &&
      self.validPassword(self.password[0])
    );
  };

  this.save = function save(conf) {
    const tasks = [
      OvhApiFreeFax.v6().voiceMailPut(
        {
          serviceName: $stateParams.serviceName,
        },
        {
          audioFormat: conf.audioFormat.value,
          forcePassword: conf.forcePassword,
          fromEmail: conf.fromEmail,
          fromName: conf.fromName,
          keepMessage: conf.keepMessage,
        },
      ).$promise,
    ];

    if (
      (conf.activateVoiceMail && initialActivateVoiceMail !== 'voicemail') ||
      (!conf.activateVoiceMail && initialActivateVoiceMail !== 'fax')
    ) {
      tasks.push(
        OvhApiFreeFax.v6().voiceMailChangeRouting(
          {
            serviceName: $stateParams.serviceName,
          },
          {
            routing: conf.activateVoiceMail ? 'voicemail' : 'fax',
          },
        ).$promise,
      );
    }
    return $q.all(tasks);
  };

  this.changePassword = function changePassword(newPassword) {
    return $q((resolve, reject) => {
      if (!self.checkPassword()) {
        TucToast.error($translate.instant('freefax_voicemail_bad_password'));
        reject($translate.instant('freefax_voicemail_bad_password'));
      } else {
        OvhApiFreeFax.v6()
          .changePassword(
            {
              serviceName: $stateParams.serviceName,
            },
            {
              password: newPassword,
            },
          )
          .$promise.then(resolve, reject);
      }
    });
  };

  init();
}
