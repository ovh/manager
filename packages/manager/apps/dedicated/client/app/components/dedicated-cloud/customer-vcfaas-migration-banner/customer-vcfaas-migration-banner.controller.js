import {
  PCC_MIGRATION_VCFAAS_URL,
  STATUS_OPERATION,
  OPERATION_REQUEST_CONTACT_FOR_VCFAAS_MIGRATION,
} from './customer-vcfaas-migration-banner.constants';

export default class DedicatedCloudCustomerVcfaasMigrationBanner {
  /* @ngInject */
  constructor($translate, coreConfig, DedicatedCloud) {
    this.coreConfig = coreConfig;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.pending = false;
    this.displayMigrationBanner = false;
    const user = this.coreConfig.getUser();
    this.offerLink =
      PCC_MIGRATION_VCFAAS_URL[user?.ovhSubsidiary] ||
      PCC_MIGRATION_VCFAAS_URL.DEFAULT;
    this.retrieveOperationRequestContactForVcdMigration();
  }

  retrieveOperationRequestContactForVcdMigration() {
    this.pending = false;
    this.displayMigrationBanner = false;
    this.DedicatedCloud.getOperations(
      this.serviceName,
      {},
      {
        name: OPERATION_REQUEST_CONTACT_FOR_VCFAAS_MIGRATION,
        state: STATUS_OPERATION,
      },
    )
      .then(({ meta }) => {
        this.displayMigrationBanner =
          !(meta && meta.totalCount > 0) && !this.vcdMigrationState;
      })

      .finally(() => {
        this.pending = false;
      });
  }

  requestContactForVmwareCloudDirectorMigration() {
    this.DedicatedCloud.requestContactForVmwareCloudDirectorMigration(
      this.serviceName,
    )
      .then(() => {
        this.setMessage(
          this.$translate.instant(
            'dedicated_cloud_dashboard_customer_vcfaas_migration_banner_success',
          ),
          'success',
        );
        this.displayMigrationBanner = false;
      })
      .catch(() => {
        this.setMessage(
          this.$translate.instant(
            'dedicated_cloud_dashboard_customer_vcfaas_migration_banner_error',
          ),
          'danger',
        );
      });
  }
}
