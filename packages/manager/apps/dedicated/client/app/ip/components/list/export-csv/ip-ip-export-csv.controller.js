import {
  CSV_HEADERS,
  CSV_FILENAME,
  CSV_DATA_ENCODING,
  CSV_DATA_SCHEME,
  CSV_SEPARATOR,
  FETCH_PAGE_SIZE,
} from './ip-ip-export.constants';
import { TRACKING_PREFIX } from '../list.constant';

export default /* @ngInject */ (
  $scope,
  $translate,
  $document,
  Alerter,
  atInternet,
  Ip,
  $q,
) => {
  let cancelFetch = null;

  $scope.loading = {
    exportCsv: false,
  };

  function fetchIps() {
    const { serviceType, otherParams } = $scope.currentActionData;
    let pageNumber = 1;
    const defered = $q.defer();
    let allIps = [];

    const cancel = () => {
      defered.resolve(allIps);
    };

    try {
      const { request: firstRequest } = Ip.fetchIps({
        serviceType,
        otherParams,
        pageNumber,
        pageSize: FETCH_PAGE_SIZE,
      });

      firstRequest.then(async ({ ips: firstIps }) => {
        let ips = firstIps;
        while (ips.length > 0) {
          allIps = allIps.concat(ips);
          pageNumber += 1;
          const { request } = Ip.fetchIps({
            serviceType,
            otherParams,
            pageNumber,
            pageSize: FETCH_PAGE_SIZE,
          });
          /* eslint-disable no-await-in-loop */
          ({ ips } = await request);
        }
        defered.resolve(allIps);
      });
    } catch (error) {
      defered.reject(error);
    }

    return {
      cancel,
      request: defered.promise,
    };
  }

  function formatIps(ips) {
    return ips.map((ip) =>
      CSV_HEADERS.reduce(
        (object, { key, getValue }) => ({ ...object, [key]: getValue(ip) }),
        {},
      ),
    );
  }

  function formatDataURL(ips) {
    const content = [
      CSV_HEADERS.map(({ key }) => key).join(CSV_SEPARATOR.CELL),
      ...ips.map((ip) => Object.values(ip).join(CSV_SEPARATOR.CELL)),
    ].join(CSV_SEPARATOR.ROW);
    return [
      CSV_DATA_SCHEME,
      Buffer.from(content).toString(CSV_DATA_ENCODING),
    ].join(CSV_SEPARATOR.SCHEME);
  }

  function downloadCSV(dataURL) {
    const link = $document[0].createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', dataURL);
      link.setAttribute('download', CSV_FILENAME);
      link.style = 'visibility:hidden';
      $document[0].body.appendChild(link);
      link.click();
      $document[0].body.removeChild(link);
    } else {
      window.open(dataURL);
    }
  }

  $scope.exportAccounts = function exportAccounts() {
    atInternet.trackClick({
      name: `${TRACKING_PREFIX}::export-csv::confirm`,
      type: 'action',
    });

    if (cancelFetch) {
      cancelFetch();
    }

    const { cancel, request } = fetchIps();

    $scope.loading.exportCsv = true;
    cancelFetch = cancel;

    request
      .then(formatIps)
      .then(formatDataURL)
      .then(downloadCSV)
      .then(() => {
        Alerter.success($translate.instant('ip_export_csv_success'));
      })
      .catch((error) => {
        if (error?.xhrStatus === 'abort') return;
        Alerter.error(`
          ${$translate.instant('ip_export_csv_error')}
          ${error.data?.message || error.message || error},
        `);
      })
      .finally(() => {
        cancelFetch = null;
        $scope.loading.exportCsv = false;
        $scope.resetAction();
      });
  };

  $scope.cancelExport = function cancelExport() {
    atInternet.trackClick({
      name: `${TRACKING_PREFIX}::export-csv::cancel`,
      type: 'action',
    });
    if (cancelFetch) {
      cancelFetch();
      cancelFetch = null;
    }
    $scope.resetAction();
  };
};
