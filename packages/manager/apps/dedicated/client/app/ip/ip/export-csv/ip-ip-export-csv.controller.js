import keys from 'lodash/keys';

export default /* @ngInject */ ($scope, $q, $translate, Alerter) => {
  let timeoutObject = null;

  $scope.data = $scope.currentActionData.ipsList;

  $scope.loading = {
    exportCsv: false,
  };

  function printCsv(datas) {
    let csvContent = '';
    let dataString;
    let link;
    let headers;
    let fileName;

    if (datas && timeoutObject) {
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

      Alerter.success($translate.instant('ip_export_csv_success'));
    } else if (!datas) {
      Alerter.error($translate.instant('ip_export_csv_error'));
    }
    timeoutObject = null;
    $scope.loading.exportCsv = false;
    $scope.resetAction();
  }

  $scope.exportAccounts = function exportAccounts() {
    $scope.loading.exportCsv = true;

    // check timeout
    if (timeoutObject) {
      timeoutObject.resolve();
    }

    // init timeout
    timeoutObject = $q.defer();

    // get data for csv
    const preparedData = [];
    angular.forEach($scope.data, (value) => {
      preparedData.push({
        ipBlock: value.ipBlock,
        ipVersion: value.version,
        type: value.type,
        country: value.country ? value.country : '',
        service: value.routedTo ? value.routedTo : '',
        description: value.description ? value.description : '',
      });
    });
    printCsv({
      ips: preparedData,
      headers: keys(preparedData[0]),
    });
  };

  $scope.cancelExport = function cancelExport() {
    timeoutObject = null;
    $scope.resetAction();
  };
};
