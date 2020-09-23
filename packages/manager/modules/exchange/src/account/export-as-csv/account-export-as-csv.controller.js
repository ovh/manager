import difference from 'lodash/difference';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import 'moment';

export default class ExchangeExportToCsvAccountsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $translate,
    Exchange,
    ExchangeExternalContacts,
    ExchangeSharedAccounts,
    messaging,
    navigation,
  ) {
    this.services = {
      $scope,
      $q,
      $translate,
      Exchange,
      ExchangeExternalContacts,
      ExchangeSharedAccounts,
      messaging,
      navigation,
    };

    this.headers = {
      external: [
        'externalEmailAddress',
        'firstName',
        'lastName',
        'displayName',
        'creationDate',
        'hiddenFromGAL',
      ],
      group: [
        'displayName',
        'mailingListAddress',
        'mailingListDisplayName',
        'mailingListName',
        'aliases',
        'members',
        'managers',
      ],
      shared: [
        'primaryEmailAddress',
        'quota',
        'firstName',
        'lastName',
        'displayName',
        'hiddenFromGAL',
      ],
    };

    this.$routerParams = Exchange.getParams();
    this.timeoutObject = null;
    this.loading = {
      exportCsv: false,
    };
    this.filterType = navigation.currentActionData.filterType;
    this.search = navigation.currentActionData.search;
    this.totalAccounts = navigation.currentActionData.total;
    this.csvExportType = navigation.currentActionData.csvExportType;
    this.exchange = Exchange.value;

    $scope.exportAccounts = () => this.exportAccounts();
    $scope.cancelExport = () => this.cancelExport();
  }

  exportAccounts() {
    const exportOpts = {
      count: 1000,
      total: this.totalAccounts,
      search: this.search,
      filter: this.filterType === 'ALL' ? null : this.filterType,
      rejectAttrs: [
        '$$hashKey',
        'currentUsage',
        'completeDomain',
        'mailingFilterList',
        'canBeConfigured',
        'initial',
        'samaccountName',
        'taskPendingId',
        'id',
      ],
      toConcatAttrs: ['totalQuota', 'usedQuota', 'quota'],
      toJointAttrs: ['aliases', 'managers', 'members'],
    };

    this.loading.exportCsv = true;

    // check timeout
    if (this.timeoutObject != null) {
      this.timeoutObject.resolve();
    }

    // init timeout
    this.timeoutObject = this.services.$q.defer();

    // get data for csv
    this.prepareForCsv(
      exportOpts,
      0,
      {
        headers: [],
        accounts: [],
      },
      this.timeoutObject.promise,
    )
      .then((datas) => {
        if (datas != null && !isEmpty(datas) && this.timeoutObject != null) {
          // get column name
          const { headers } = datas;
          let csvContent = `${headers.join(';')}\n`;

          forEach(datas.accounts, (data, index) => {
            let dataString = '';

            forEach(headers, (header) => {
              if (includes(exportOpts.toJointAttrs, header)) {
                dataString += `${data[header].join(',')};`;
              } else if (includes(exportOpts.toConcatAttrs, header)) {
                dataString += `${data[header].value + data[header].unit};`;
              } else {
                dataString += `${data[header]};`;
              }
            });

            csvContent +=
              index < datas.accounts.length ? `${dataString}\n` : dataString;
          });

          const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
          });

          const fileName = `export_${this.csvExportType}_${
            this.exchange.displayName
          }_${moment().format('YYYY-MM-DD_HH:mm:ss')}.csv`;

          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');

            if (link.download != null) {
              const url = window.URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', fileName);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              window.open(
                `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
              );
            }
          }

          this.services.messaging.writeSuccess(
            this.services.$translate.instant('exchange_ACTION_export_success'),
          );
        } else if (datas != null || isEmpty(datas)) {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_export_error'),
          );
        }

        this.timeoutObject = null;
        this.loading.exportCsv = false;
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  cancelExport() {
    this.timeoutObject = null;
    this.services.navigation.resetAction();
  }

  prepareForCsv(exportOpts, offset, infos, timeoutObject) {
    let promise = null;
    switch (this.csvExportType) {
      case 'accounts':
        promise = this.services.Exchange.prepareForCsv(
          this.exchange,
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      case 'group':
        promise = this.services.Exchange.prepareGroupsForCsv(
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      case 'external':
        promise = this.services.ExchangeExternalContacts.prepareForCsv(
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      case 'shared':
        promise = this.services.ExchangeSharedAccounts.prepareForCsv(
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      default:
        break;
    }

    return promise.then((datas) => {
      if (datas != null) {
        set(infos, 'accounts', infos.accounts.concat(datas.accounts));
        set(
          infos,
          'headers',
          isEmpty(infos.headers) ? datas.headers : infos.headers,
        );

        if (['group', 'external', 'shared'].includes(this.csvExportType)) {
          set(infos, 'headers', this.headers[this.csvExportType]);
        } else {
          set(
            infos,
            'headers',
            difference(datas.headers, exportOpts.rejectAttrs),
          );
        }

        if (offset + exportOpts.count < exportOpts.total) {
          return this.prepareForCsv(
            exportOpts,
            offset + exportOpts.count,
            infos,
            timeoutObject,
          );
        }
        return infos;
      }

      return null;
    });
  }
}
