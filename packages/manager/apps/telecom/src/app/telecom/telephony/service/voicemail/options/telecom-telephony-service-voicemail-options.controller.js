angular.module('managerApp').controller('TelecomTelephonyServiceVoicemailOptionsCtrl', function ($scope, $stateParams, $q, $translate, $timeout, TucToastError, OvhApiTelephony, OvhApiMe) {
  const self = this;
  let removeRecord = null;

  function fetchEnums() {
    return OvhApiTelephony.v6().schema({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then(schema => ({
      audioFormat: schema.models['telephony.ServiceVoicemailAudioFormatEnum'].enum,
      mailOption: schema.models['telephony.ServiceVoicemailMailOptionEnum'].enum,
    }));
  }

  function fetchSettings() {
    return OvhApiTelephony.Voicemail().v6().getSettings({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  }

  function fetchGreetings() {
    return OvhApiTelephony.Voicemail().Greetings().v6().query({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise.then((result) => {
      if (result.length) {
        return $q.all({
          greeting: OvhApiTelephony.Voicemail().Greetings().v6().get({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: _.first(result),
          }).$promise,
          download: OvhApiTelephony.Voicemail().Greetings().v6().download({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: _.first(result),
          }).$promise.catch(() => {
            // sometimes api fails to retrieve a download URL,
            // since it's not blocking we don't want to reject an error
            TucToastError($translate.instant('telephony_line_answer_voicemail_options_recording_file_download_error'));
            return { filename: null, url: null };
          }),
        }).then((data) => {
          const res = {};
          _.assign(res, _.pick(data.greeting, ['dir', 'id']));
          _.assign(res, _.pick(data.download, ['filename', 'url']));
          return res;
        });
      }
      return null;
    });
  }

  function refreshSettings() {
    OvhApiTelephony.Voicemail().v6().resetCache();
    OvhApiTelephony.Voicemail().v6().resetQueryCache();
    return fetchSettings().then((settings) => {
      self.settings = settings;
      _.assign(self.recordingForm, _.pick(settings, ['doNotRecord']));
      _.assign(self.notificationForm, _.pick(settings, ['audioFormat', 'keepMessage', 'fromName', 'fromEmail']));
    });
  }

  function refreshGreetings() {
    OvhApiTelephony.Voicemail().Greetings().v6().resetCache();
    OvhApiTelephony.Voicemail().Greetings().v6().resetQueryCache();
    return fetchGreetings().then((greetings) => {
      self.greetings = greetings;
      _.assign(self.recordingForm, _.pick(greetings, ['filename', 'url', 'dir']));
    });
  }

  function refreshAll() {
    return $q.all([refreshSettings(), refreshGreetings()]);
  }

  function pickEditableSettings(settings) {
    return _.pick(settings, ['audioFormat', 'doNotRecord', 'forcePassword', 'fromEmail',
      'fromName', 'keepMessage', 'redirectionEmails']);
  }

  function init() {
    self.loading = true;
    self.enums = {};
    self.settings = {}; // current settings from API
    self.greetings = {};

    // recording options form
    self.recordingForm = {
      doNotRecord: null,
      uploadedFile: null,
      dir: 'greet',
      filename: null,
      url: null,
      isUpdating: false,
      isSuccess: false,
    };

    // notification add email form
    self.emailForm = {
      email: null,
      type: null,
      isShown: false,
      isAdding: false,
      isRemoving: false,
    };

    // notification options form
    self.notificationForm = {
      audioFormat: null,
      keepMessage: null,
      fromName: null,
      fromEmail: null,
      isUpdating: false,
      isSuccess: false,
    };

    return $q.all({
      enums: fetchEnums(),
      data: refreshAll(),
    }).then((result) => {
      self.enums = result.enums;
    }).catch((err) => {
      self.settings = null;
      self.greetings = null;
      return new TucToastError(err);
    }).finally(() => {
      self.loading = false;
    });
  }

  // true if user made some changes in notification options, false otherwise
  self.notificationChanged = function () {
    return self.notificationForm.audioFormat !== self.settings.audioFormat
      || self.notificationForm.keepMessage !== self.settings.keepMessage
      || self.notificationForm.fromName !== self.settings.fromName
      || self.notificationForm.fromEmail !== self.settings.fromEmail;
  };

  self.recordingChanged = function () {
    return (self.recordingForm.doNotRecord !== self.settings.doNotRecord)
      || self.recordingForm.uploadedFile || removeRecord;
  };

  self.checkValidAudioExtention = function (file) {
    const validExtensions = ['aiff', 'au', 'flac', 'ogg', 'mp3', 'wav', 'wma'];
    const fileName = file ? file.name : '';
    const found = _.some(validExtensions, ext => _.endsWith(fileName.toLowerCase(), ext));
    if (!found) {
      TucToastError($translate.instant('telephony_line_answer_voicemail_options_recording_file_invalid'));
    }
    return found;
  };

  self.updateRecording = function () {
    // update changes
    const settings = pickEditableSettings(self.settings);
    _.assign(settings, _.pick(self.recordingForm, ['doNotRecord']));

    const update = function () {
      const promises = {
        settings: OvhApiTelephony.Voicemail().v6().setSettings({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        }, settings).$promise.then(() => refreshSettings()),
      };

      if (removeRecord) {
        promises.greetings = OvhApiTelephony.Voicemail().Greetings().v6().delete({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          id: removeRecord,
        }).$promise.then(() => {
          removeRecord = null;
        });
      }

      return $q.all(promises);
    };

    let uploadFile = $timeout(angular.noop, 1000);
    if (self.recordingForm.uploadedFile) {
      uploadFile = function () {
        return OvhApiMe.Document().v6().upload(
          self.recordingForm.uploadedFile.name,
          self.recordingForm.uploadedFile,
        ).then(doc => OvhApiTelephony.Voicemail().Greetings().v6().create({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        }, {
          documentId: doc.id,
          dir: self.recordingForm.dir,
        }).$promise)
          .then(() => {
            /**
             * This is not sexy but there are some delay for greetings to be refreshed.
             * So we need to loop some queries until data is up to date after file upload.
             */
            const oldGreetings = angular.copy(self.greetings);
            let maxRetries = 10; // avoid deadly infinite loop
            const refresh = function () {
              return refreshAll().then(() => {
                if (--maxRetries < 0) { // eslint-disable-line
                  return $q.reject('Unable to retrieve uploaded file');
                } if (!self.greetings
                    || (oldGreetings && oldGreetings.filename === self.greetings.filename)) {
                  return $timeout(refresh, 1500);
                }
                return $q.when(null);
              });
            };
            return refresh();
          });
      };
    }

    self.recordingForm.isUpdating = true;
    self.cancelAddEmail();
    self.recordingForm.isSuccess = false;

    return update().then(uploadFile).then(() => {
      self.recordingForm.isSuccess = true;
      self.recordingForm.uploadedFile = null;
      $timeout(() => {
        self.recordingForm.isSuccess = false; // reset form
      }, 3000);
    }).catch(err => new TucToastError(err))
      .finally(() => {
        self.recordingForm.isUpdating = false;
      });
  };

  // update notification options
  self.updateSettings = function () {
    // update changes
    const settings = pickEditableSettings(self.settings);
    _.assign(settings, _.pick(self.notificationForm, ['audioFormat', 'keepMessage', 'fromName', 'fromEmail']));

    self.notificationForm.isUpdating = true;
    self.cancelAddEmail();

    const update = OvhApiTelephony.Voicemail().v6().setSettings({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, settings).$promise;

    return $q.all({
      noop: $timeout(angular.noop, 1000), // avoid clipping
      update,
    }).then(() => refreshSettings()).then(() => {
      self.notificationForm.isSuccess = true;
      $timeout(() => {
        self.notificationForm.isSuccess = false; // reset form
      }, 3000);
    }).catch(err => new TucToastError(err))
      .finally(() => {
        self.notificationForm.isUpdating = false;
      });
  };

  // delete a notification email
  self.removeEmail = function (redirection) {
    // update changes
    const settings = pickEditableSettings(self.settings);
    _.remove(settings.redirectionEmails, {
      email: redirection.email,
      type: redirection.type,
    });

    self.emailForm.isRemoving = true;
    _.set(redirection, 'removing', true);

    const update = OvhApiTelephony.Voicemail().v6().setSettings({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, settings).$promise;

    $q.all({
      noop: $timeout(angular.noop, 1000), // avoid clipping
      update,
    }).then(() => refreshSettings()).catch(err => new TucToastError(err)).finally(() => {
      self.emailForm.isRemoving = false;
    });
  };

  // add a new notification email
  self.addEmail = function () {
    // update changes
    const settings = pickEditableSettings(self.settings);
    settings.redirectionEmails.push({
      email: self.emailForm.email,
      type: self.emailForm.type,
    });

    self.emailForm.isAdding = true;

    const update = OvhApiTelephony.Voicemail().v6().setSettings({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, settings).$promise;

    $q.all({
      noop: $timeout(angular.noop, 500), // avoid clipping
      update,
    }).then(() => refreshSettings()).then(() => {
      self.emailForm.email = null;
      self.emailForm.type = null;
      self.emailForm.isShown = false;
    }).catch(err => new TucToastError(err))
      .finally(() => {
        self.emailForm.isAdding = false;
      });
  };

  // cancel creation of new notification email
  self.cancelAddEmail = function () {
    self.emailForm.email = null;
    self.emailForm.type = null;
    self.emailForm.isShown = false;
  };

  self.removeRecordSound = function () {
    self.settings.annouceMessage = null;
    removeRecord = self.greetings.id;
    self.greetings = null;
  };

  init();
});
