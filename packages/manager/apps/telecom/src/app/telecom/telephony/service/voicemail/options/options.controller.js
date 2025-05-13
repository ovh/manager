import assign from 'lodash/assign';
import endsWith from 'lodash/endsWith';
import head from 'lodash/head';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

export default /* @ngInject */ function TelecomTelephonyServiceVoicemailOptionsCtrl(
  $scope,
  $stateParams,
  $q,
  $translate,
  $timeout,
  TucToastError,
  OvhApiTelephony,
  OvhApiMe,
) {
  const self = this;
  let removeRecord = null;

  function fetchEnums() {
    return OvhApiTelephony.v6()
      .schema({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((schema) => ({
        audioFormat:
          schema.models['telephony.ServiceVoicemailAudioFormatEnum'].enum,
        mailOption:
          schema.models['telephony.ServiceVoicemailMailOptionEnum'].enum,
      }));
  }

  function fetchSettings() {
    return OvhApiTelephony.Voicemail()
      .v6()
      .getSettings({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise;
  }

  function fetchGreetings() {
    return OvhApiTelephony.Voicemail()
      .Greetings()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((result) => {
        if (result.length) {
          return $q
            .all({
              greeting: OvhApiTelephony.Voicemail()
                .Greetings()
                .v6()
                .get({
                  billingAccount: $stateParams.billingAccount,
                  serviceName: $stateParams.serviceName,
                  id: head(result),
                }).$promise,
              download: OvhApiTelephony.Voicemail()
                .Greetings()
                .v6()
                .download({
                  billingAccount: $stateParams.billingAccount,
                  serviceName: $stateParams.serviceName,
                  id: head(result),
                })
                .$promise.catch(() => {
                  // sometimes api fails to retrieve a download URL,
                  // since it's not blocking we don't want to reject an error
                  TucToastError(
                    $translate.instant(
                      'telephony_line_answer_voicemail_options_recording_file_download_error',
                    ),
                  );
                  return { filename: null, url: null };
                }),
            })
            .then((data) => {
              const res = {};
              assign(res, pick(data.greeting, ['dir', 'id']));
              assign(res, pick(data.download, ['filename', 'url']));
              return res;
            });
        }
        return null;
      });
  }

  function refreshSettings() {
    OvhApiTelephony.Voicemail()
      .v6()
      .resetCache();
    OvhApiTelephony.Voicemail()
      .v6()
      .resetQueryCache();
    return fetchSettings().then((settings) => {
      self.settings = settings;
      assign(self.recordingForm, pick(settings, ['doNotRecord']));
      assign(
        self.notificationForm,
        pick(settings, ['audioFormat', 'keepMessage', 'fromName', 'fromEmail']),
      );
    });
  }

  function refreshGreetings() {
    OvhApiTelephony.Voicemail()
      .Greetings()
      .v6()
      .resetCache();
    OvhApiTelephony.Voicemail()
      .Greetings()
      .v6()
      .resetQueryCache();
    return fetchGreetings().then((greetings) => {
      self.greetings = greetings;
      assign(self.recordingForm, pick(greetings, ['filename', 'url', 'dir']));
    });
  }

  function refreshAll() {
    return $q.all([refreshSettings(), refreshGreetings()]);
  }

  function pickEditableSettings(settings) {
    return pick(settings, [
      'audioFormat',
      'doNotRecord',
      'forcePassword',
      'fromEmail',
      'fromName',
      'keepMessage',
      'redirectionEmails',
    ]);
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

    return $q
      .all({
        enums: fetchEnums(),
        data: refreshAll(),
      })
      .then((result) => {
        self.enums = result.enums;
      })
      .catch((err) => {
        self.settings = null;
        self.greetings = null;
        return new TucToastError(err);
      })
      .finally(() => {
        self.loading = false;
      });
  }

  // true if user made some changes in notification options, false otherwise
  self.notificationChanged = function notificationChanged() {
    return (
      self.notificationForm.audioFormat !== self.settings.audioFormat ||
      self.notificationForm.keepMessage !== self.settings.keepMessage ||
      self.notificationForm.fromName !== self.settings.fromName ||
      self.notificationForm.fromEmail !== self.settings.fromEmail
    );
  };

  self.recordingChanged = function recordingChanged() {
    return (
      self.recordingForm.doNotRecord !== self.settings.doNotRecord ||
      self.recordingForm.uploadedFile ||
      removeRecord
    );
  };

  self.checkValidAudioExtention = function checkValidAudioExtention(file) {
    const validExtensions = ['aiff', 'au', 'flac', 'ogg', 'mp3', 'wav', 'wma'];
    const fileName = file ? file.name : '';
    const found = some(validExtensions, (ext) =>
      endsWith(fileName.toLowerCase(), ext),
    );
    if (!found) {
      TucToastError(
        $translate.instant(
          'telephony_line_answer_voicemail_options_recording_file_invalid',
        ),
      );
    }
    return found;
  };

  self.updateRecording = function updateRecording() {
    // update changes
    const settings = pickEditableSettings(self.settings);
    assign(settings, pick(self.recordingForm, ['doNotRecord']));

    const update = function update() {
      const promises = {
        settings: OvhApiTelephony.Voicemail()
          .v6()
          .setSettings(
            {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
            },
            settings,
          )
          .$promise.then(() => refreshSettings()),
      };

      if (removeRecord) {
        promises.greetings = OvhApiTelephony.Voicemail()
          .Greetings()
          .v6()
          .delete({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: removeRecord,
          })
          .$promise.then(() => {
            removeRecord = null;
          });
      }

      return $q.all(promises);
    };

    let uploadFile = $timeout(angular.noop, 1000);
    if (self.recordingForm.uploadedFile) {
      uploadFile = function uploadFileFunction() {
        return OvhApiMe.Document()
          .v6()
          .upload(
            self.recordingForm.uploadedFile.name,
            self.recordingForm.uploadedFile,
          )
          .then(
            (doc) =>
              OvhApiTelephony.Voicemail()
                .Greetings()
                .v6()
                .create(
                  {
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                  },
                  {
                    documentId: doc.id,
                    dir: self.recordingForm.dir,
                  },
                ).$promise,
          )
          .then(() => {
            /**
             * This is not sexy but there are some delay for greetings to be refreshed.
             * So we need to loop some queries until data is up to date after file upload.
             */
            const oldGreetings = angular.copy(self.greetings);
            let maxRetries = 10; // avoid deadly infinite loop
            const refresh = function refresh() {
              return refreshAll().then(() => {
                // eslint-disable-next-line no-plusplus
                if (--maxRetries < 0) {
                  return $q.reject('Unable to retrieve uploaded file');
                }
                if (
                  !self.greetings ||
                  (oldGreetings &&
                    oldGreetings.filename === self.greetings.filename)
                ) {
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

    return update()
      .then(uploadFile)
      .then(() => {
        self.recordingForm.isSuccess = true;
        self.recordingForm.uploadedFile = null;
        $timeout(() => {
          self.recordingForm.isSuccess = false; // reset form
        }, 3000);
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.recordingForm.isUpdating = false;
      });
  };

  // update notification options
  self.updateSettings = function updateSettings() {
    // update changes
    const settings = pickEditableSettings(self.settings);
    assign(
      settings,
      pick(self.notificationForm, [
        'audioFormat',
        'keepMessage',
        'fromName',
        'fromEmail',
      ]),
    );

    self.notificationForm.isUpdating = true;
    self.cancelAddEmail();

    const update = OvhApiTelephony.Voicemail()
      .v6()
      .setSettings(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        settings,
      ).$promise;

    return $q
      .all({
        noop: $timeout(angular.noop, 1000), // avoid clipping
        update,
      })
      .then(() => refreshSettings())
      .then(() => {
        self.notificationForm.isSuccess = true;
        $timeout(() => {
          self.notificationForm.isSuccess = false; // reset form
        }, 3000);
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.notificationForm.isUpdating = false;
      });
  };

  // delete a notification email
  self.removeEmail = function removeEmail(redirection) {
    // update changes
    const settings = pickEditableSettings(self.settings);
    remove(settings.redirectionEmails, {
      email: redirection.email,
      type: redirection.type,
    });

    self.emailForm.isRemoving = true;
    set(redirection, 'removing', true);

    const update = OvhApiTelephony.Voicemail()
      .v6()
      .setSettings(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        settings,
      ).$promise;

    $q.all({
      noop: $timeout(angular.noop, 1000), // avoid clipping
      update,
    })
      .then(() => refreshSettings())
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.emailForm.isRemoving = false;
      });
  };

  // add a new notification email
  self.addEmail = function addEmail() {
    // update changes
    const settings = pickEditableSettings(self.settings);
    settings.redirectionEmails.push({
      email: self.emailForm.email,
      type: self.emailForm.type,
    });

    self.emailForm.isAdding = true;

    const update = OvhApiTelephony.Voicemail()
      .v6()
      .setSettings(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        settings,
      ).$promise;

    $q.all({
      noop: $timeout(angular.noop, 500), // avoid clipping
      update,
    })
      .then(() => refreshSettings())
      .then(() => {
        self.emailForm.email = null;
        self.emailForm.type = null;
        self.emailForm.isShown = false;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.emailForm.isAdding = false;
      });
  };

  // cancel creation of new notification email
  self.cancelAddEmail = function cancelAddEmail() {
    self.emailForm.email = null;
    self.emailForm.type = null;
    self.emailForm.isShown = false;
  };

  self.removeRecordSound = function removeRecordSound() {
    self.settings.annouceMessage = null;
    removeRecord = self.greetings.id;
    self.greetings = null;
  };

  init();
}
