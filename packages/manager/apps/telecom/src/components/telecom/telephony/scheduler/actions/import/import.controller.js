import endsWith from 'lodash/endsWith';
import isNull from 'lodash/isNull';
import some from 'lodash/some';

export default /* @ngInject */ function TelephonySchedulerImportCtrl(
  $timeout,
  $uibModalInstance,
  modalData,
  OvhApiMe,
) {
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
    return OvhApiMe.Document()
      .v6()
      .upload(self.model.icsFile.name, self.model.icsFile);
  }

  self.checkIcsFileType = function checkIcsFileType(file) {
    if (isNull(file)) {
      self.isFileExtentionInvalid = false;
    } else {
      const validExtensions = ['ics', 'ical'];
      const fileName = file ? file.name : '';
      self.isFileExtentionInvalid = !some(validExtensions, (ext) =>
        endsWith(fileName.toLowerCase(), ext),
      );
    }
    return self.isFileExtentionInvalid;
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function close(datas) {
    return $uibModalInstance.close(datas);
  };

  self.startImport = function startImport() {
    self.loading.import = true;

    // upload file to /me/document
    return uploadFile()
      .then((document) =>
        self.scheduler.importIcsCalendar(document.getUrl).then((importTask) => {
          self.status.uploaded = true;

          return $timeout(() => {
            self.close({
              importTask,
              uploadedDocument: document,
            });
          }, 1000);
        }),
      )
      .catch((error) => self.cancel(error))
      .finally(() => {
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
}
