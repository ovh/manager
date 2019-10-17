import endsWith from 'lodash/endsWith';

export default class {
  /* @ngInject */
  constructor($timeout, $translate, OvhApiTelephony) {
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.isLoading = false;
    this.hasChecked = false;
  }

  uploadFile() {
    this.isLoading = true;
    return this.$q.all({
      noop: this.$timeout(angular.noop, 5000),
      upload: this.OvhApiTelephony.Portability().PortabilityDocument().v6().create({
        billingAccount: this.billingAccount,
        id: this.data.id,
      }, {
        name: this.uploadedFile.name,
      }),
    }).then(() => this.goBack(
      this.$translate.instant('portabilities_attach_document_succeed'),
    ))
      .catch(() => this.goBack(
        this.$translate.instant('portabilities_attach_document_failed'),
        'error',
      ))
      .finally(() => {
        this.isLoading = false;
      });
  }

  checkValidFileExtention(file) {
    const pdfType = '.pdf';
    const fileName = file ? file.name : '';
    this.validFormatFile = endsWith(fileName.toLowerCase(), pdfType);
    this.hasChecked = true;

    return this.validFormatFile;
  }
}
