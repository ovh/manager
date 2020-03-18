export default /* @ngInject */ function ($parse, $q, exportCsv) {
  return {
    scope: {
      exportCsv: '&',
      name: '@exportCsvFileName',
      separator: '@exportCsvSeparator',
    },
    replace: false,
    compile() {
      const exp = $parse('exportToCSV();');

      return function ($scope, $elm) {
        $scope.exportToCSV = function () {
          $q.when($scope.exportCsv()).then((dataToExport) => {
            if (dataToExport) {
              exportCsv.exportData({
                fileName: $scope.name,
                separator: $scope.separator,
                datas: dataToExport,
              });
            }
          });
        };

        $elm.bind('click', () => {
          exp($scope);
        });
      };
    },
  };
}
