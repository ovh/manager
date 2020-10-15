export default class voipTimeConditionConfiguration {
  /* @ngInject */
  constructor($http, $q, $timeout, OvhApiMe) {
    this.$http = $http;
    this.$q = $q;
    this.$timeout = $timeout;
    this.OvhApiMe = OvhApiMe;
  }

  exportConfiguration(data) {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then((me) => {
        const fileName = `${me.nichandle}_${moment().format(
          'YYYY_MM_DD_HHmmss_SSS',
        )}.json`;
        const jsonData = JSON.stringify(data);

        const blob = new Blob([jsonData], { type: 'application/json' });

        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const downloadLink = document.createElement('a');
          downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
          downloadLink.setAttribute('download', fileName);
          downloadLink.setAttribute('target', '_blank');
          downloadLink.setAttribute('style', 'visibility:hidden');

          document.body.appendChild(downloadLink);
          this.$timeout(() => {
            downloadLink.click();
            document.body.removeChild(downloadLink);
          });
        }

        return this.$q.when();
      });
  }

  importConfiguration(file) {
    return this.OvhApiMe.Document()
      .v6()
      .upload(file.name, file)
      .then((doc) =>
        this.OvhApiMe.Document()
          .v6()
          .get({
            id: doc.id,
          })
          .$promise.then((newDoc) =>
            this.$http
              .get(newDoc.getUrl)
              .then((data) => data)
              .catch((error) => this.$q.reject(error)),
          ),
      );
  }
}
