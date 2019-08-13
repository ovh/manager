angular.module('managerApp').controller('TelephonySchedulerImportCtrl', function ($timeout, $uibModalInstance, modalData, OvhApiMe) {
  const self = this;

  self.model = {
    icsFile: null,
  };

  self.status = {
    uploaded: false,
  };

  self.loading = {
    import: false,
  };

  self.isFileExtentionInvalid = false;
  self.scheduler = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function uploadFile() {
    return OvhApiMe.Document().v6().upload(self.model.icsFile.name, self.model.icsFile);
  }

  self.checkIcsFileType = function (file) {
    if (_.isNull(file)) {
      self.isFileExtentionInvalid = false;
    } else {
      const validExtensions = ['ics', 'ical'];
      const fileName = file ? file.name : '';
      self.isFileExtentionInvalid = !_.some(
        validExtensions,
        ext => _.endsWith(fileName.toLowerCase(), ext),
      );
    }
    return self.isFileExtentionInvalid;
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.cancel = function (message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function (datas) {
    return $uibModalInstance.close(datas);
  };

  self.startImport = function () {
    self.loading.import = true;

    // upload file to /me/document
    return uploadFile()
      .then(document => self.scheduler.importIcsCalendar(document.getUrl).then((importTask) => {
        self.status.uploaded = true;

        return $timeout(() => {
          self.close({
            importTask,
            uploadedDocument: document,
          });
        }, 1000);
      })).catch(error => self.cancel(error)).finally(() => {
        self.loading.import = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.scheduler = modalData.scheduler;
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
