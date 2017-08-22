/**
 * @ngdoc directive
 * @name ovh-angular-export-csv.directive:exportCsv
 * @description
 * # ovh-angular-export-csv
 */
angular.module("ovh-angular-export-csv").directive("exportCsv", ["$q", "$parse", "exportCsv", function ($q, $parse, CSV) {
    "use strict";

    return {
        scope: {
            exportCsv: "&",
            name: "@exportCsvFileName",
            separator: "@exportCsvSeparator"
        },
        replace: false,
        compile: function () {
            var exp = $parse("exportToCSV();");

            return function ($scope, $elm) {
                $scope.exportToCSV = function () {
                    $q.when($scope.exportCsv()).then(function (dataToExport) {
                        if (dataToExport) {
                            CSV.exportData({
                                fileName: $scope.name,
                                separator: $scope.separator,
                                datas: dataToExport
                            });
                        }
                    });
                };

                $elm.bind("click", function () {
                    exp($scope);
                });
            };
        }
    };
}]);
