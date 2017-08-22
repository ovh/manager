/**
 * @ngdoc service
 * @name ovh-angular-export-csv.service:exportCsv
 * @description
 * # ovh-angular-export-csv
 * Service in the ovh-angular-export-csv.
 */
angular.module("ovh-angular-export-csv").service("exportCsv", ["$location", function ($location) {

    "use strict";

    var self = this;
    var internalCache = {};
    var internalStatus = {
        notFound: "NOT_FOUND",
        doing: "DOING",
        error: "ERROR"
    };

    this.exportData = function (opts) {

        var link;
        var csvContent = "";
        var lines = [];
        var fileName;
        var seperator = opts.separator || ",";
        var dataString;

        if (!opts.fileName) {
            fileName = $location.path().replace(/\//, "");
            fileName = fileName.replace(/\//g, "-");
            if ($location.search().TAB) {
                fileName += $location.search().TAB;
            }
        } else {
            fileName = opts.fileName;
        }

        fileName += "-" + moment().format("YYYY-MM-DD_HH:mm:ss") + ".csv";

        if (typeof opts.datas === "string") {
            csvContent = opts.datas;
        } else if (Object.prototype.toString.call(opts.datas) === "[object Array]") {
            angular.forEach(opts.datas, function (line) {
                lines.push(line.join(seperator));
            });
            csvContent = csvContent + lines.join("\n");
        } else {
            csvContent = csvContent + opts.datas.join("\n");
        }

        if (navigator.platform.toUpperCase().indexOf("WIN") > -1) {
            dataString = "data:text/csv;charset=windows-1252;base64," +
                    btoa(unescape(encodeURIComponent(csvContent)));
        } else {
            dataString = "data:text/csv;charset=utf-8;base64," +
                    btoa(unescape(encodeURIComponent(csvContent)));
        }

        link = document.createElement("a");
        if (link.download !== undefined) {

            link.setAttribute("href", dataString);

            link.setAttribute("download", fileName);
            link.setAttribute("style", "visibility:hidden");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(dataString);
        }

        return dataString;

    };

    function saveDataSnapshot (options) {
        var instanceName;

        if (!options.instanceName) {
            throw new Error("[wroughtDataForCsv()]: missing options");
        }

        instanceName = options.instanceName.toString();

        if (!internalCache[instanceName]) {
            internalCache[instanceName] = {};
        }

        internalCache[instanceName].data = options.internalData;
    }

    function setDataStatus (options, status, error) {
        if (!options.instanceName) {
            throw new Error("missing instanceName");
        }

        if (!internalStatus[status]) {
            throw new Error("invalide status");
        }

        internalCache[options.instanceName.toString()].status = internalStatus[status];

        if (status === "error") {
            if (error) {
                internalCache[options.instanceName.toString()].error = error;
            } else {
                internalCache[options.instanceName.toString()].error = null;
            }
        }
    }

    function wroughtDataForCsvError (options, error) {
        if (options.notify) {
            options.notify(options.internalData);
        }

        setDataStatus(options, "error", error);

        if (options.error) {
            options.error(error, options.internalData);
        }
    }

    /*
     * prepare data needed to export of CSV
     * @param {object} object of options: \{
     *      `` MANDATORY ``
     *      instanceName {string} arbitrary string to identify the process
     *      iterator {function} the function called until the job is done (must return a promise)
     *      keepGoing {function} the function called at each iteration loop to known if the job is
     *              done or if we have to call the iterator again
     *      `` OPTIONAL ``
     *      notify {function} function called after each iteration
     *      done {function} function called when the job is done
     * \}
     *
     * @return undefined
     * */
    this.wroughtDataForCsv = function (options, callHimself) {
        if (!options || !options.instanceName || !options.iterator || !options.keepGoing) {
            throw new Error("[wroughtDataForCsv()]: missing options");
        }

        if (!callHimself && self.getExportCsvStatus === internalStatus.doing) {
            wroughtDataForCsvError(options, new Error("the process " + options.instanceName +
                    " is already in progress"));
        }

        saveDataSnapshot(options);
        setDataStatus(options, "doing");

        options.iterator(options.internalData).then(function () {
            if (options.notify) {
                options.notify(options.internalData);
            }

            options.keepGoing(options.internalData).then(function (keepGoing) {
                if (keepGoing) {
                    self.wroughtDataForCsv(options, true);
                } else {
                    if (options.done) {
                        options.done(options.internalData);
                    }

                    delete internalCache[options.instanceName.toString()];
                }
            }, function (err) {
                wroughtDataForCsvError(options, err);
            });
        }, function (err) {
            wroughtDataForCsvError(options, err);
        });
    };

    this.getExportCsvStatus = function (instanceName) {
        if (!instanceName) {
            throw new Error("[getExportCsvStatus()]: missing instance name");
        }

        return internalCache[instanceName] ? internalCache[instanceName].status : internalStatus.notFound;
    };

    this.getExportCsvError = function (instanceName) {
        if (!instanceName) {
            throw new Error("[getExportCsvError()]: missing instance name");
        }

        return internalCache[instanceName] && internalCache[instanceName].error ?
            internalCache[instanceName].error : null;
    };

    Object.defineProperty(self, "statusEnum", {
        enumerable: true,
        configurable: false,
        get: function () {
            return angular.copy(internalStatus);
        },
        set: function () {
            throw new Error("'statusEnum' is a read only property");
        }
    });
}]);
