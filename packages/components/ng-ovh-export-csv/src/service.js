import angular from 'angular';
import moment from 'moment';

export default /* @ngInject */ function ($location) {
  const self = this;
  const internalCache = {};
  const internalStatus = {
    notFound: 'NOT_FOUND',
    doing: 'DOING',
    error: 'ERROR',
  };

  this.exportData = function exportData(opts) {
    let csvContent = '';
    const lines = [];
    let filename;
    const seperator = opts.separator || ',';
    let dataString;

    if (!opts.fileName) {
      filename = $location.path().replace(/\//, '');
      filename = filename.replace(/\//g, '-');
      if ($location.search().TAB) {
        filename += $location.search().TAB;
      }
    } else {
      filename = opts.fileName;
    }

    filename += `-${moment().format('YYYY-MM-DD_HH:mm:ss')}.csv`;

    if (typeof opts.datas === 'string') {
      csvContent = opts.datas;
    } else if (
      Object.prototype.toString.call(opts.datas) === '[object Array]'
    ) {
      angular.forEach(opts.datas, (line) => {
        lines.push(line.join(seperator));
      });
      csvContent += lines.join('\n');
    } else {
      csvContent += opts.datas.join('\n');
    }

    if (navigator.platform.toUpperCase().indexOf('WIN') > -1) {
      dataString = `data:text/csv;charset=windows-1252;base64,${btoa(
        unescape(encodeURIComponent(csvContent)),
      )}`;
    } else {
      dataString = `data:text/csv;charset=utf-8;base64,${btoa(
        unescape(encodeURIComponent(csvContent)),
      )}`;
    }

    const link = document.createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', dataString);

      link.setAttribute('download', filename);
      link.setAttribute('style', 'visibility:hidden');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(dataString);
    }

    return dataString;
  };

  function saveDataSnapshot(options) {
    if (!options.instanceName) {
      throw new Error('[wroughtDataForCsv()]: missing options');
    }

    const instanceName = options.instanceName.toString();

    if (!internalCache[instanceName]) {
      internalCache[instanceName] = {};
    }

    internalCache[instanceName].data = options.internalData;
  }

  function setDataStatus(options, status, error) {
    if (!options.instanceName) {
      throw new Error('missing instanceName');
    }

    if (!internalStatus[status]) {
      throw new Error('invalide status');
    }

    internalCache[options.instanceName.toString()].status =
      internalStatus[status];

    if (status === 'error') {
      if (error) {
        internalCache[options.instanceName.toString()].error = error;
      } else {
        internalCache[options.instanceName.toString()].error = null;
      }
    }
  }

  function wroughtDataForCsvError(options, error) {
    if (options.notify) {
      options.notify(options.internalData);
    }

    setDataStatus(options, 'error', error);

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
  this.wroughtDataForCsv = function wroughtDataForCsv(options, callHimself) {
    if (
      !options ||
      !options.instanceName ||
      !options.iterator ||
      !options.keepGoing
    ) {
      throw new Error('[wroughtDataForCsv()]: missing options');
    }

    if (!callHimself && self.getExportCsvStatus === internalStatus.doing) {
      wroughtDataForCsvError(
        options,
        new Error(`the process ${options.instanceName} is already in progress`),
      );
    }

    saveDataSnapshot(options);
    setDataStatus(options, 'doing');

    options.iterator(options.internalData).then(
      () => {
        if (options.notify) {
          options.notify(options.internalData);
        }

        options.keepGoing(options.internalData).then(
          (keepGoing) => {
            if (keepGoing) {
              self.wroughtDataForCsv(options, true);
            } else {
              if (options.done) {
                options.done(options.internalData);
              }

              delete internalCache[options.instanceName.toString()];
            }
          },
          (err) => {
            wroughtDataForCsvError(options, err);
          },
        );
      },
      (err) => {
        wroughtDataForCsvError(options, err);
      },
    );
  };

  this.getExportCsvStatus = function getExportCsvStatus(instanceName) {
    if (!instanceName) {
      throw new Error('[getExportCsvStatus()]: missing instance name');
    }

    return internalCache[instanceName]
      ? internalCache[instanceName].status
      : internalStatus.notFound;
  };

  this.getExportCsvError = function getExportCsvError(instanceName) {
    if (!instanceName) {
      throw new Error('[getExportCsvError()]: missing instance name');
    }

    return internalCache[instanceName] && internalCache[instanceName].error
      ? internalCache[instanceName].error
      : null;
  };

  Object.defineProperty(self, 'statusEnum', {
    enumerable: true,
    configurable: false,
    get() {
      return angular.copy(internalStatus);
    },
    set() {
      throw new Error("'statusEnum' is a read only property");
    },
  });
}
