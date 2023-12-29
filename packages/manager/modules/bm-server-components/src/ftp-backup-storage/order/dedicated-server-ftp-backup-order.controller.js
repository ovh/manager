import { FTP_BACKUP_STORAGE_ALERT } from '../ftp-backup.constants';

export default class FtpBackupOrdercontroller {
  /* @ngInject */
  constructor($stateParams, $translate, Server, Alerter) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Server = Server;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
    this.order = {
      model: null,
      choiceIndex: null,
      bc: null,
      agreeContract: false,
    };
  }

  load() {
    this.loading = true;
    this.Server.getFtpBackupOrder(this.$stateParams.productId).then(
      (data) => {
        this.order.model = data;
        this.loading = false;
      },
      (reason) => {
        this.loading = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_order_load_failure',
            { t0: this.access },
          ),
          reason,
          FTP_BACKUP_STORAGE_ALERT,
        );
        this.goBack();
      },
    );
  }

  getDetail() {
    this.loading = true;
    this.Server.getFtpBackupOrderDetail(
      this.$stateParams.productId,
      this.order.model[this.order.choiceIndex].capacity,
    )
      .then((data) => {
        this.order.bc = data;
        this.order.bc.details[0].explanation = {
          price: this.order.model[this.order.choiceIndex].price,
        };
      })
      .catch((reason) => {
        this.goBack().then(() =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_order_load_detail_failure',
              { t0: this.access },
            ),
            reason,
            FTP_BACKUP_STORAGE_ALERT,
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  orderCapacity() {
    this.loading = true;
    this.Server.postFtpBackupOrderDetail(
      this.$stateParams.productId,
      this.order.bc.duration,
      this.order.model[this.order.choiceIndex].capacity,
    ).then(
      (data) => {
        window.open(data.url, '_blank');
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_order_load_order_success',
            {
              t0: data.url,
              t1: data.orderId,
            },
          ),
          true,
          FTP_BACKUP_STORAGE_ALERT,
        );
        this.loading = false;
        this.goBack();
      },
      (reason) => {
        this.loading = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_order_load_order_failure',
            { t0: this.access },
          ),
          reason,
          FTP_BACKUP_STORAGE_ALERT,
        );
        this.goBack();
      },
    );
  }
}
