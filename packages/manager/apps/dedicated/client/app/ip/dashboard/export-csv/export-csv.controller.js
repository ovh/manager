import keys from 'lodash/keys';

export default class {
  /* @ngInject */
  constructor($q, $scope, $translate) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.timeoutObject = null;

    this.$scope.loading = {
      exportCsv: false,
    };

    this.$scope.cancelExport = this.cancelExport.bind(this);
    this.$scope.exportAccounts = this.exportAccounts.bind(this);
  }

  printCsv(datas) {
    let csvContent = '';
    let dataString;
    let link;
    let headers;
    let fileName;

    if (datas && this.timeoutObject) {
      // get column name
      headers = datas.headers;
      csvContent += `${headers.join(';')}\n`;
      angular.forEach(datas.ips, (data, index) => {
        dataString = '';
        angular.forEach(headers, (header) => {
          dataString += `${data[header]};`;
        });
        csvContent += index < datas.ips.length ? `${dataString}\n` : dataString;
      });

      fileName = 'export_ips.csv';
      link = document.createElement('a');
      if (link.download !== undefined) {
        link.setAttribute(
          'href',
          `data:text/csv;charset=ISO-8859-1;base64,${btoa(csvContent)}`,
        );
        link.setAttribute('download', fileName);
        link.style = 'visibility:hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(
          `data:text/csv;charset=ISO-8859-1;base64,${btoa(csvContent)}`,
        );
      }

      this.timeoutObject = null;
      return this.goBack({
        message: {
          text: this.$translate.instant('ip_export_csv_success'),
          data: 'OK',
        },
      });
    }
    if (!datas) {
      this.timeoutObject = null;
      return this.goBack({
        message: {
          text: this.$translate.instant('ip_export_csv_error'),
          data: 'ERROR',
        },
      });
    }

    this.$scope.loading.exportCsv = false;
    return this.cancelExport();
  }

  exportAccounts() {
    this.$scope.loading.exportCsv = true;

    // check timeout
    if (this.timeoutObject) {
      this.timeoutObject.resolve();
    }

    // init timeout
    this.timeoutObject = this.$q.defer();

    // get data for csv
    const preparedData = [];
    angular.forEach(this.ipsList, (value) => {
      preparedData.push({
        ipBlock: value.ipBlock,
        ipVersion: value.version,
        type: value.type,
        country: value.country ? value.country : '',
        service: value.routedTo ? value.routedTo : '',
        description: value.description ? value.description : '',
      });
    });

    this.printCsv({
      ips: preparedData,
      headers: keys(preparedData[0]),
    });
  }

  cancelExport() {
    this.timeoutObject = null;
    return this.goBack();
  }
}
